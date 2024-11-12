import {
  ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity,
  View, Image, ScrollView,
  Modal, Platform
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUserToEvent, deleteUserFromEvent, editAnswer, fetchEvent, getPossibleUser } from '../../redux/actions/actionEvent';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Button,
  Icon,
  BottomSheet,
  Divider
} from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME_COLOR } from '../../constants';

const SECONDARY_COLOR = '#FF6584';
const EventDetails = ({ navigation, route }) => {
  const [event, setEvent] = useState(null);
  const [role, setRole] = useState();
  const [idUser, setIdUser] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState(1);
  const [token, setToken] = useState(null);
  const [addModalAnswerVisible, setAddModalAnswerVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [participantFilter, setParticipantFilter] = useState(0);
  const [participants, setParticipants] = useState([])
  const [filtredParticipants, setFiltredParticipants] = useState([])
  let idEvent = route.params.eventId
  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        setRole(user.role);
        setIdUser(user.userId);
        const result = await dispatch(fetchEvent(tokens, idEvent));
        setEvent(result);
        setParticipants(result.participants)
        setFiltredParticipants(result.participants)
        let participantAnswer = result.participants.filter(p => p.user.idUser == user.userId);
        setAnswer(participantAnswer[0]);
        const result2 = await dispatch(getPossibleUser(token, result.idEvent))
        setUserToAdd(result2)
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteParticipant = async () => {
    let deleteUser = await dispatch(deleteUserFromEvent(token, event.idEvent, selectedParticipant.user.idUser));
    load();
    setDeleteModalVisible(false);
  };
  const renderFilterButton = () => (
    <TouchableOpacity
      style={styles.floatingFilterButton}
      onPress={() => setFilterVisible(true)}
    >
      <LinearGradient
        colors={[THEME_COLOR, '#FF8BA7']}
        style={styles.filterGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon name="filter-list" color="#fff" size={24} />
        <Text style={styles.filterButtonText}>Filter</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  useEffect(() => {
    load();
  }, [token])
  const applyFilters = () => {
    let filtered = [];
    if (participantFilter === 1) {
      filtered = participants.filter(participant => participant.answer === 1);

    } else if (participantFilter === 2) {
      filtered = participants.filter(participant => participant.answer === 2);
    } else if (participantFilter === 3) {
      filtered = participants.filter(participant => participant.answer === 3);
    } else {
      filtered = participants
    }

    setFiltredParticipants(filtered);
    setFilterVisible(false);
  };
  const renderAvailableUser = ({ item }) => (
    <TouchableOpacity style={styles.availableUserItem} onPress={() => addParticipant(item)}>
      <Image
        source={
          item.photo
            ? { uri: item.photo }
            : item.gender === 'MALE'
              ? require('../../assets/avatar0.png')
              : require('../../assets/avatar2.png')
        }
        style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );
  const openDeleteModal = (participant) => {
    setSelectedParticipant(participant);
    setDeleteModalVisible(true);
  };
  const renderDeleteModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalDeleteContainer}>
          <Icon
            name="warning"
            type="material"
            color="#e74c3c"
            size={50}
          />
          <Text style={styles.modalDeleteTitle}>Are you sure?</Text>
          <Text style={styles.modalDeleteText}>
            {selectedParticipant != null && `Are you sure you want to delete ${selectedParticipant.user.firstName}?`}
          </Text>
          <View style={styles.buttonDeleteContainer}>
            <TouchableOpacity style={styles.cancelDeleteButton} onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.buttonDeleteTextModal}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmDeleteButton} onPress={deleteParticipant}>
              <Text style={styles.buttonTextModalDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderMember = ({ item }) => (
    <View
      style={[styles.memberItem, { backgroundColor: getStatusColor(item.answer) }]}
    >
      <Image
        source={
          item.user.photo
            ? { uri: item.user.photo }
            : item.user.gender === 'MALE'
              ? require('../../assets/avatar0.png')
              : require('../../assets/avatar2.png')
        }
        style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
        <Text style={styles.memberEmail}>{item.user.email}</Text>
        <Text style={styles.ticketStatus}> participate: <Text style={styles.ticketStatusValue}>{item.answer == 1 ? "Refuse" : item.answer == 2 ? "Maybe" : "Participe"}</Text></Text>
      </View>
      <TouchableOpacity onPress={() => openDeleteModal(item)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <Image
        source={
          item.user.photo
            ? { uri: item.user.photo }
            : item.gender === 'MALE'
              ? require('../../assets/avatar0.png')
              : require('../../assets/avatar2.png')
        }
        style={styles.participantPhoto} />
      <Text style={styles.participantName}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
    </View>
  );

  const updateAnswer = async (newAnswer) => {
    let updateAnswer = await dispatch(editAnswer(token, event.idEvent, idUser, newAnswer))
    load();
    setAddModalAnswerVisible(false)
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return '#f8d7da';
      case 2: return '#fff3cd';
      case 3: return '#87CEFA';
      default: return '#FFFFFF';
    }
  };
  const addParticipant = async (item) => {
    let addGuest = await dispatch(addUserToEvent(token, event.idEvent, item.idUser));
    load();
    setShowAddModal(false)
  }
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{event.label}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {event.date}</Text>
        </View>
        <TouchableOpacity style={styles.forumLink}
          onPress={() => { navigation.navigate('ListForum', { eventId: idEvent }) }}
        >
          <MaterialIcons name="link" size={24} color="#0984e3" />
          <Text style={styles.forumLinkText}> Forums</Text>
        </TouchableOpacity>
        <View style={styles.headerGuest}>
          <Text style={styles.sectionTitle}>Guests</Text>
          {role == 'ADMIN' &&
            <TouchableOpacity style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="person-add" color="#4CAF50" size={20} />
              <Text style={styles.buttonText}>
                Add Guest
              </Text>
            </TouchableOpacity>}
        </View>

        {role == "ADMIN" ?
          <>
            <FlatList
              data={filtredParticipants}
              renderItem={renderMember}
              keyExtractor={(item) => item.user.idUser.toString()}
              style={styles.memberList}
            />

          </>
          :
          <><FlatList
            data={event.participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.user.idUser.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Your Answer:
                <Text style={{
                  ...styles.ticketStatusValue,
                  color: answer.answer == 1 ? "#FFA07A" : answer.answer == 2 ? "#98FB98" : "#87CEFA"
                }}>
                  {answer.answer == 1 ? "    No" : answer.answer == 2 ? "    Maybe" : "    Participate"}
                </Text>
              </Text>
              <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalAnswerVisible(true)} >
                <MaterialIcons name="edit" size={18} color="#4a90e2" />
                <Text style={styles.actionText}>modify</Text>
              </TouchableOpacity>
            </View>

          </>
        }
        <View style={{ height: 80 }} />
        {role=='ADMIN'&&renderFilterButton()}


        <Modal visible={addModalAnswerVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Answer</Text>
              <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#FFA07A" }}
                onPress={() => updateAnswer(1)}>
                <View style={styles.memberInfo}>
                  <Text>NO</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#98FB98" }}
                onPress={() => updateAnswer(2)}>
                <View style={styles.memberInfo}>
                  <Text>Maybe</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#87CEFA" }}
                onPress={() => updateAnswer(3)}>
                <View style={styles.memberInfo}>
                  <Text>Participate</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
                onPress={() => setAddModalAnswerVisible(false)}
              >
                <Text style={styles.modalButtonText}>close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={showAddModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add guest</Text>
              <FlatList
                data={userToAdd}
                renderItem={renderAvailableUser}
                keyExtractor={(item) => item.id}
                style={styles.availableUserList}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setParticipantFilter(3)}
              >
                <View style={styles.radioCircleParticipate}>
                  {participantFilter === 3 && <View style={styles.selectedRbParticipate} />}
                </View>
                <Text style={styles.radioText}>Participate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setParticipantFilter(2)}
              >
                <View style={styles.radioCircleMaybe}>
                  {participantFilter === 2 && <View style={styles.selectedRbMaybe} />}
                </View>
                <Text style={styles.radioText}>Maybe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setParticipantFilter(1)}
              >
                <View style={styles.radioCircleRefuse}>
                  {participantFilter === 1 && <View style={styles.selectedRbRefuse} />}
                </View>
                <Text style={styles.radioText}>Refuse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setParticipantFilter(0)}
              >
                <View style={styles.radioCircle}>
                  {participantFilter === 0 && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>All</Text>
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
        {renderDeleteModal()}
      </View>
    )
  }
}

export default EventDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: THEME_COLOR,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: THEME_COLOR,
  },
  participantItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  participantPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  participantName: {
    textAlign: 'center',
    fontSize: 12,
  },
  ticketList: {
    marginBottom: 20,
  },
  ticketItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
    backgroundColor: '#e0e0e0',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  ticketStatusValue: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  availableUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  memberPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    color: 'gray',
  },
  membreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    padding: 5
  },
  memberList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  memberPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    color: 'gray',
  },
  deleteButton: {
    padding: 5,
  },
  commentsSection: {
    padding: 10,
    justifyContent: 'space-between',
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: '#333',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#4a90e2',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    marginRight: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    marginBottom: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  availableUserList: {
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonDelete: {
    backgroundColor: "#FF0000",
  },
  buttonCancel: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  addParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  addParticipantText: {
    marginLeft: 10,
    color: 'blue',
    fontSize: 16,
  },
  headerGuest: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  forumLink: {
    marginTop: 10,
    alignItems: 'left',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  forumLinkText: {
    color: '#0984e3',
    fontWeight: 'bold',
    marginTop: 3
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDeleteContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalDeleteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  modalDeleteText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelDeleteButton: {
    flex: 1,
    backgroundColor: '#bdc3c7',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonTextModalDelete: {
    color: '#fff',
    fontWeight: 'bold',
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
  radioButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
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
  radioCircleParticipate: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#87CEFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleRefuse: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f8d7da',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleMaybe: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff3cd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
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
  applyButton: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  selectedRbParticipate: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#87CEFA',
  },
  selectedRbRefuse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f8d7da',
  },
  selectedRbMaybe: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff3cd',
  },
});