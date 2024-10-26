import {
  ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity,
  View, Image, ScrollView,
  Modal
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUserToEvent, deleteUserFromEvent, editAnswer, fetchEvent, getPossibleUser } from '../../redux/actions/actionEvent';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteForumById } from '../../redux/actions/actionForum';
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
  const [userToAdd,setUserToAdd]= useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const[selectedForumId,setSelectedForumId] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteForumModalVisible, setDeleteForumModalVisible] = useState(false);
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
        let participantAnswer = result.participants.filter(p => p.user.idUser == user.userId);
        setAnswer(participantAnswer[0]);
        const result2 = await dispatch(getPossibleUser(token,result.idEvent))
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
  const openDeleteForumModal = (idForum) => {
    setSelectedForumId(idForum);
    setDeleteForumModalVisible(true);
  };
  const deleteParticipant = async() => {
    console.log("here")
   let deleteUser = await dispatch(deleteUserFromEvent(token,event.idEvent,selectedParticipant.user.idUser));
    load();
    setDeleteModalVisible(false);
  };
  const deleteForums = async()=>{
    try{
    let deletedForum= await dispatch(deleteForumById(token, selectedForumId));
    }catch(error){
        console.log("error delete: "+error)
    }
    load();
    setDeleteForumModalVisible(false);
  }
  useEffect(() => {
    load();
  }, [token])
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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure you want to delete this guest?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setDeleteModalVisible(false)}
            >
            <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={deleteParticipant}
            >
              <Text style={styles.textStyle}>Validate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
 const renderDeleteForumModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteForumModalVisible}
      onRequestClose={() => setDeleteForumModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure you want to delete this forum?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setDeleteForumModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={deleteForums}
            >
              <Text style={styles.textStyle}>Validate</Text>
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
        <Text style={styles.ticketStatus}> participate: <Text style={styles.ticketStatusValue}>{item.answer == 1 ? "NO" : item.answer == 2 ? "Maybe" : "Participe"}</Text></Text>
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
  const renderForum = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ForumDetails', {idForum: item.idForum, loadForumDetails: load })}
      style={[styles.ticketItem]}
    >
      <Text style={styles.ticketTitle}>{item.title}</Text>
      {role=="ADMIN"&&<TouchableOpacity onPress={() => openDeleteForumModal(item.idForum)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>}
    </TouchableOpacity>
  );
  const updateAnswer = async (newAnswer) => {
    let updateAnswer = await dispatch(editAnswer(token, event.idEvent, idUser, newAnswer))
    load();
    setAddModalAnswerVisible(false)
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return '#FFA07A';
      case 2: return '#98FB98';
      case 3: return '#87CEFA';
      default: return '#FFFFFF';
    }
  };
  const addParticipant = async(item)=>{
    let addGuest = await dispatch(addUserToEvent(token,event.idEvent,item.idUser));
    load();
    setShowAddModal(false)
  }
   const renderForumFooter = (idEvent) => {
    return role === 'ADMIN' ?(
    <TouchableOpacity
      style={styles.addParticipantButton}
      onPress={() => { navigation.navigate('AddForum', {eventId: idEvent, loadEventDetails:load })}
      }
    >
      <MaterialIcons name="add" size={24} color="blue" />
      <Text style={styles.addParticipantText}>Add Forum</Text>
    </TouchableOpacity>
    ):null
   };
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
  } else {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{event.label}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {event.date}</Text>
        </View>
        <Text style={styles.sectionTitle}>Guests</Text>
        {role == "ADMIN" ?
          <><FlatList
            data={event.participants}
            renderItem={renderMember}
            keyExtractor={(item) => item.user.idUser.toString()}
            style={styles.memberList}
          />
            <TouchableOpacity style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="person-add" color="white" size={20} />
              <Text style={styles.buttonText}>
                Add Guest
              </Text>
            </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>Forums</Text>
        <FlatList
          data={event.forums}
          renderItem={renderForum}
          keyExtractor={(item) => item.idForum.toString()}
          style={styles.ticketList}
          ListFooterComponent={ renderForumFooter(event.idEvent)}
        />
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
        {renderDeleteModal()}
        {renderDeleteForumModal()}
      </ScrollView>
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
    color: '#007bff',
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
    color: '#007bff',
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
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    
    alignSelf: "center",
    flexDirection: "row",
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
});