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
import * as Notifications from 'expo-notifications';

import {
    Header,
    Text,
    Button,
    Icon,
    ListItem,
    BottomSheet,
    Input,
    Chip,
    Divider,
    Badge
} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchNotification } from '../redux/actions/actionNotification';
import { Formedate } from '../.expo/utils/formatDate';
import { THEME_COLOR } from '../constants';
const { width } = Dimensions.get('window');
const SECONDARY_COLOR = '#FF6584';
const Settings = ({ navigation, route }) => {

    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState();
    const [notifications, setNotifications] = useState();
    const [notificationFilter, setNotificationFilter] = useState('all');
    const [orderByDate, setOrderByDate] = useState(false);
    const [orderByName, setOrderByName] = useState(false);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
            let user = JSON.parse(userDetails);
            setToken(user.token);
            setRole(user.role);
            let idUser = user.userId;
            setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
            console.log({ user })
            const tokenDevice = (await Notifications.getExpoPushTokenAsync()).data;
            let notification = {
                'token': tokenDevice,
                'idReciver': user.userId
            }
            let result = await dispatch(fetchNotification(token, notification));
            setNotifications(result);
            setFilteredNotifications(result)
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, [userId]);


    const filterNotification = (timeFilter) => {
        setNotificationFilter(timeFilter);
    };

    const toggleOrderByDate = () => {
        setOrderByDate(true);
        setOrderByName(false);

    };

    const toggleOrderByName = () => {
        setOrderByName(true);
        setOrderByDate(false);
    };
    // ... États précédents ...
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [isActionVisible, setActionVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // États pour les filtres
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]); // État manquant
    // Animations


    // Fonction pour gérer les filtres
    const removeFilter = (filterToRemove) => {
        let newActiveFilters = [];
        newActiveFilters = activeFilters.filter(filter => filter.type !== filterToRemove.type);
        setActiveFilters(newActiveFilters);

        setNotificationFilter(null);
        // Réappliquer les filtres après suppression
        setTimeout(() => applyFilters(), 20);

    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simuler le chargement des données
        setTimeout(() => {
            setNotifications(notifications);
            setFilteredNotifications(notifications)
            setRefreshing(false);
        }, 1000);
    }, []);
    const applyFilters = () => {
        let filtered = [...notifications];
        let newActiveFilters = [];

        if (notificationFilter == "Group") {
            filtered = notifications.filter(notification => notification.type > 0 && notification.type <= 3);
            newActiveFilters.push({
                type: 'Group',
                value: 'hidden',
                label: 'Group'
            });
        } else if (notificationFilter == "Event") {
            filtered = notifications.filter(notification => notification.type > 3 && notification.type <= 6);
            newActiveFilters.push({
                type: 'Event',
                value: 'hidden',
                label: 'Event'
            });
        } else if (notificationFilter == "Project") {
            filtered = notifications.filter(notification => notification.type > 6 && notification.type <= 10);
            newActiveFilters.push({
                type: 'Project',
                value: 'hidden',
                label: 'Project'
            });
        } else if (notificationFilter == "Survey") {
            filtered = notifications.filter(notification => notification.type > 10 && notification.type <= 14);
            newActiveFilters.push({
                type: 'Survey',
                value: 'hidden',
                label: 'Survey'
            });
        }


        //setEvents(filtered);
        setFilteredNotifications(filtered)
        setActiveFilters(newActiveFilters);
        setFilterVisible(false);
    };
    const navigateTo = (notification) => {
        let type = notification.type;
        if (type == 1 || type == 2 || type == 3) {
            navigation.navigate("Sujets")
        } else if (type == 4 || type == 5 || type == 6) {
            navigation.navigate("Listes")
        } else if (type == 7 || type == 8 || type == 9 || type == 10) {
            navigation.navigate("Signets")
        } else if (type == 11 || type == 12 || type == 13 || type == 14) {
            navigation.navigate("Moments")
        }
    }
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
                <Text style={styles.headerTitle}>My Notifications</Text>

            </View>
        </LinearGradient>
    );

    const renderEventItem = ({ item: notification, index }) => (
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
                    notification.badgeCount==1 ? styles.unreadNotification : null,
                    { borderLeftColor: getNotificationColor(notification), borderLeftWidth: 4 } // Assurez-vous de définir la largeur pour que la couleur soit visible
                ]}
                onPress={() => { navigateTo(notification) }}
            >

                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{notification.title}</Text>

                </View>
                <View style={styles.eventDetails}>
                    <View style={styles.eventInfo}>
                        <Icon name="event" size={16} color="#666" style={styles.eventIcon} />
                        <Text style={styles.eventDate}>
                            {notification.description}
                        </Text>
                    </View>
                    <View style={styles.eventInfo}>
                        <Icon name="event" size={16} color="#666" style={styles.eventIcon} />

                        <Text style={styles.eventDate}>
                            {notification.date}
                        </Text>
                    </View>
                </View>
                {notification.badgeCount==1 && (
                    <Badge status="error" containerStyle={styles.badge} />
                )}
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
    const getNotificationColor = (notification) => {
        let type = notification.type;
        if (type == 1 || type == 2 || type == 3) {
            return "#98FB98";
        } else if (type == 4 || type == 5 || type == 6) {
            return "#87CEFA";
        } else if (type == 7 || type == 8 || type == 9 || type == 10) {
            return "#FFD700";
        } else if (type == 11 || type == 12 || type == 13 || type == 14) {
            return "#FFD700";
        }
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
                {notifications != undefined &&
                    <FlatList
                        data={filteredNotifications}
                        keyExtractor={(notification) => notification.idNotification.toString()}
                        renderItem={renderEventItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
                    <Text style={styles.sousTiteText}>Type:</Text>
                    <View style={styles.radioButtonContainer}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => filterNotification('Group')}
                        >
                            <View style={styles.radioCircle}>
                                {notificationFilter === 'Group' && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.radioText}>Group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => filterNotification('Event')}
                        >
                            <View style={styles.radioCircle}>
                                {notificationFilter === 'Event' && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.radioText}>Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => filterNotification('Project')}
                        >
                            <View style={styles.radioCircle}>
                                {notificationFilter === 'Project' && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.radioText}>Project</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => filterNotification('Survey')}
                        >
                            <View style={styles.radioCircle}>
                                {notificationFilter === 'Survey' && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.radioText}>Survey</Text>
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
     badge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff', // Couleur de fond pour les notifications non lues
  },

});

export default Settings


