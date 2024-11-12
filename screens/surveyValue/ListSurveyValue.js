import { deleteSurveyValueById, fetchSurveyValues } from '../../redux/actions/actionSurveyValue';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
  Modal
} from 'react-native';
import { ScrollView, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import {
  Header,
  Text,
  Button,
  Icon,
  BottomSheet,
  Input,
  Chip,
  Divider
} from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { THEME_COLOR } from '../../constants';

const SECONDARY_COLOR = '#FF6584';
const ListSurveyValue = ({ route, navigation }) => {
  let idSurvey = route.params.idSurvey
  const [values, setValues] = useState();
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null);
  const [orderByName, setOrderByName] = useState(false);
  const [filteredValue, setFilteredValue] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        const result = await dispatch(fetchSurveyValues(tokens, idSurvey));
        setValues(result);
        setFilteredValue(result);
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [token])
const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <LottieView
                source={require('../../assets/no_data.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
  const toggleOrderByName = () => {
    setOrderByName(true);
  };


  // ... États précédents ...
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isActionVisible, setActionVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // États pour les filtres
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState([]); // État manquant
  // Animations


  // Fonction pour gérer les filtres
  const removeFilter = (filterToRemove) => {
    let newActiveFilters = [];
    newActiveFilters = activeFilters.filter(filter => filter.type !== filterToRemove.type);
    setActiveFilters(newActiveFilters);
    switch (filterToRemove.type) {
      case 'search':
        setSearchText('');
        break;
      case 'sort':
        if (filterToRemove.value == "label") {
          setOrderByName(false)
        }
        break;
    }

    // Réappliquer les filtres après suppression
    setTimeout(() => applyFilters(), 20);

  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setValues(values);
      setFilteredValue(values)
      setRefreshing(false);
    }, 1000);
  }, []);
  const applyFilters = () => {
    let filtered = [...values];
    let newActiveFilters = [];
    const now = new Date();
    if (searchText.trim()) {
      filtered = filtered.filter(value =>
        value.title.toLowerCase().includes(searchText.toLowerCase())
      );
      newActiveFilters.push({
        type: 'search',
        value: searchText,
        label: `Recherche: ${searchText}`
      });
    }

    if (orderByName) {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      newActiveFilters.push({
        type: 'sort',
        value: 'label',
        label: 'order by title'
      });
    }
    setFilteredValue(filtered)
    setActiveFilters(newActiveFilters);
    setFilterVisible(false);
  };

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const renderHeader = () => (
    <LinearGradient
      colors={[THEME_COLOR, '#8A84FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Options</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("AddSurveyValue", { idSurvey: idSurvey, loadList: load })
          }}
        >
          <Icon name="add" color="#fff" size={28} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderSurveyItem = ({ item: value, index }) => (
    <Animated.View
      style={[
        styles.eventContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.eventCard,
          { borderLeftColor: value.colorCode, borderLeftWidth: 4 }
        ]}
      //onPress={() => navigation.navigate('SurveyDetails', { idSurvey: survey.idSurvey })}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{value.title}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(value);
              setActionVisible(true);
            }}
          >
            <Icon name="more-vert" color={THEME_COLOR} />
          </TouchableOpacity>

        </View>
        <View style={styles.eventDetails}>
          <View style={styles.eventInfo}>
            <Icon name="subject" type="material" size={16} color="#666" style={styles.eventIcon} />
            <Text style={styles.eventDate}>
              {value.description.substring(0, 10)}...

            </Text>
          </View>

        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterButton = () => (
    <TouchableOpacity
      style={styles.floatingFilterButton}
      onPress={() => setFilterVisible(true)}
    >
      <LinearGradient
        colors={[SECONDARY_COLOR, '#FF8BA7']}
        style={styles.filterGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon name="filter-list" color="#fff" size={24} />
        <Text style={styles.filterButtonText}>Filter </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const onConfirmeDeleteValue = async () => {
     const result = await dispatch(deleteSurveyValueById(token, selectedValue.idSurveyValue));
    load()
    setModalVisible(false);
    setActionVisible(false);
    setSelectedValue(null)
  }
  const editValue = () => {
    setActionVisible(false);
     navigation.navigate('UpdateSurveyValue', { surveyValue: selectedValue, loadList: load }) 
  }
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Chips des filtres actifs */}
        <View style={styles.chipsContainer}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              title={filter.label}
              icon={{
                name: 'close',
                size: 16,
                color: THEME_COLOR,
                type: 'material'
              }}
              onPress={() => removeFilter(filter)}
              buttonStyle={styles.chipButton}
              titleStyle={styles.chipTitle}
              containerStyle={styles.chip}
            />
          ))}
        </View>
        {/* Liste des événements */}
        {values != undefined &&
          <FlatList
            data={filteredValue}
            keyExtractor={(value) => value.idSurveyValue.toString()}
            renderItem={renderSurveyItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={renderEmptyList}
          />
        }

        <View style={{ height: 80 }} />
      </ScrollView>

      {renderFilterButton()}
      {/* BottomSheet des filtres */}
      <BottomSheet
        isVisible={isFilterVisible}
        onBackdropPress={() => setFilterVisible(false)}
        backdropStyle={{ backgroundColor: 'transparent' }} // Enlève le fond sombre
        containerStyle={styles.bottomSheet}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Filtres</Text>
            <Divider style={styles.bottomSheetDivider} />
          </View>

          <Input
            placeholder="Search"
            leftIcon={{
              name: 'search',
              color: THEME_COLOR,
              size: 20
            }}
            inputContainerStyle={styles.searchInput}
            inputStyle={styles.searchInputText}
            value={searchText}
            onChangeText={setSearchText}
          />





          <Text style={styles.sousTiteText}>Sort:</Text>
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={toggleOrderByName}
            >
              <View style={styles.radioCircle}>
                {orderByName && <View style={styles.selectedRb} />}
              </View>
              <Text style={styles.radioText}>Sort by Label</Text>
            </TouchableOpacity>
          </View>
          <Button
            title="Apply filters"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: [THEME_COLOR, '#8A84FF'],
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
            }}
            onPress={applyFilters}
            buttonStyle={styles.applyButton}
            titleStyle={styles.applyButtonText}
            icon={{
              name: 'check',
              color: '#fff',
              size: 20
            }}
          />
        </View>
      </BottomSheet>

      {/* BottomSheet des actions */}
      <BottomSheet
        isVisible={isActionVisible}
        onBackdropPress={() => setActionVisible(false)}
        modalProps={{
          animationType: 'slide',
          transparent: true,   // Assure que le fond est transparent
          presentationStyle: Platform.OS === 'ios' ? 'overFullScreen' : 'fullScreen',  // Important pour iOS
        }}
        containerStyle={styles.bottomSheetContainerMore} // Style personnalisé

      >
        <View style={styles.actionSheet}>
          <Button
            title="Edit Value"
            icon={{ name: 'edit', color: THEME_COLOR, size: 20 }}
            type="clear"
            titleStyle={[styles.actionButtonText, { color: THEME_COLOR }]}
            buttonStyle={styles.actionButton}
            onPress={editValue}
          />
          <Divider />
          <Button
            title="Delete Value"
            icon={{ name: 'delete', color: '#FF3B30', size: 20 }}
            type="clear"
            titleStyle={[styles.actionButtonText, { color: '#FF3B30' }]}
            buttonStyle={styles.actionButton}
            onPress={() => setModalVisible(true)}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Icon
                name="warning"
                type="material"
                color="#e74c3c"
                size={50}
              />
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Text style={styles.modalText}>
                {selectedValue != null && `Do you really want to delete ${selectedValue.title}?`}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonTextModal}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirmeDeleteValue}>
                  <Text style={styles.buttonTextModal}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  chip: {
    margin: 4,
    backgroundColor: '#F0F3FF',
    borderRadius: 20,
  },
  chipButton: {
    backgroundColor: 'transparent',
  },
  chipTitle: {
    color: THEME_COLOR,
    fontSize: 12,
  },
  eventContainer: {
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  eventDetails: {
    marginTop: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventIcon: {
    marginRight: 8,
  },
  eventDate: {
    color: '#666',
    fontSize: 14,
  },
  eventCreator: {
    color: '#666',
    fontSize: 14,
  },
  floatingFilterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  filterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSheetContainer: {
    backgroundColor: 'white', // Couleur de fond
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetContainerMore: {
    backgroundColor: 'transparent', // Couleur de fond
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  bottomSheetDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  searchInputText: {
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  filterOptions: {
    marginVertical: 15,
  },
  filterOptionButton: {
    marginVertical: 5,
    borderColor: THEME_COLOR,
    borderRadius: 10,
    padding: 12,
  },
  filterOptionText: {
    color: THEME_COLOR,
    marginLeft: 8,
  },
  applyButton: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  actionButton: {
    paddingVertical: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  /* bottomSheetContainer: {
   backgroundColor: 'transparent', // Couleur de fond
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
   padding: 16,
   elevation: 10, // Ombre pour donner de la profondeur
 },*/
  backdropStyle: {
    backgroundColor: 'transparent', // Enlève le fond sombre
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  datePicker: {
    marginLeft: 10,
    flex: 1,
  },
  radioButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCirclePast: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleCurrent: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#98FB98',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleFutur: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#87CEFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  selectedRbPast: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  selectedRbCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#98FB98',
  },
  selectedRbFutur: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#87CEFA',
  },






  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#bdc3c7',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonTextModal: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sousTiteText: {
    fontSize: 18,
    color: THEME_COLOR,
    fontWeight: 'bold',
  },
  emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },

});

export default ListSurveyValue 