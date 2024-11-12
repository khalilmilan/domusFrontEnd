import {
  ActivityIndicator, FlatList, StyleSheet, Text, ScrollView,
  Image,
  View,
  TouchableOpacity,
  Modal
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUserToProject, deleteUserFromProject, fetchProject, getPossibleUser } from '../../redux/actions/actionProject';
import { PieChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Button,
  Icon,
  BottomSheet,
  Divider
} from '@rneui/themed';
import { THEME_COLOR } from '../../constants';
const ProjectDetails = ({ navigation, route }) => {
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState();
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteForumModalVisible, setDeleteForumModalVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState([]);
  let idProject = route.params.idProject
  useEffect(() => {
    load();
  }, [token])
  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        setRole(user.role)
        const result = await dispatch(fetchProject(tokens, idProject));
        setProject(result);
        if (user.role == "ADMIN") {
          //setTickets(result.tickets)
        } else {
          const ticketsParticipant = result.tickets.filter(t => t.userAffectedTo.idUser == user.userId);
          //setTickets(ticketsParticipant)
        }
        const result2 = await dispatch(getPossibleUser(tokens, idProject))
        setUserToAdd(result2)
        // Faites quelque chose avec profileData ici
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }
  const addParticipant = async (item) => {
    let addUser = await dispatch(addUserToProject(token, project.idProject, item.idUser));
    load();
    setShowAddModal(false)
  }
  const deleteParticipant = async () => {
    let deleteUser = await dispatch(deleteUserFromProject(token, project.idProject, selectedParticipant.idUser));
    load();
    setDeleteModalVisible(false);
  };
  const deleteForums = async () => {
    try {
      //let deletedForum= await dispatch(deleteForumById(token, selectedForumId));
    } catch (error) {
      console.log("error delete: " + error)
    }
    load();
    setDeleteForumModalVisible(false);
  }

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
            {selectedParticipant != null && `Are you sure you want to delete ${selectedParticipant.firstName}?`}
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

  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <Image
        source={
          item.photo
            ? { uri: item.photo }
            : item.gender === 'MALE'
              ? require('../../assets/avatar0.png')
              : require('../../assets/avatar2.png')
        }
        style={styles.participantPhoto} />
      <Text style={styles.participantName}>{`${item.firstName} ${item.lastName}`}</Text>
    </View>
  );
 
  const openDeleteModal = (participant) => {
    setSelectedParticipant(participant);
    setDeleteModalVisible(true);
  };
  const renderMember = ({ item }) => (
    <View
      style={[styles.memberItem]}
    >
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
      <TouchableOpacity onPress={() => openDeleteModal(item)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
  const calculateProgress = () => {
    const total = project.tickets.length;
    const finished = project.tickets.filter(t => t.status == 3).length;
    const inProgress = project.tickets.filter(t => t.status === 2).length;
    const todo = project.tickets.filter(t => t.status === 1).length;
    return [
      { name: 'Finished', population: finished, color: '#87CEFA', legendFontColor: '#7F7F7F' },
      { name: 'In progress', population: inProgress, color: '#98FB98', legendFontColor: '#7F7F7F' },
      { name: 'To do', population: todo, color: '#FFA07A', legendFontColor: '#7F7F7F' },
    ];
  };
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
  } else {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.description}>{project.description}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Start date: {project.startDate}</Text>
          <Text style={styles.dateText}>End date: {project.endDate}</Text>
        </View>
        {role == "ADMIN" && <>
          <Text style={styles.sectionTitle}> Project progress</Text>
          <PieChart
            data={calculateProgress()}
            width={300}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </>}
        <TouchableOpacity style={styles.forumLink}
          onPress={() => { navigation.navigate('ListTicket', { idProject: idProject }) }}
        >
          <MaterialIcons name="link" size={24} color="#0984e3" />
          <Text style={styles.forumLinkText}> Tickets</Text>
        </TouchableOpacity>
        <View style={styles.headerGuest}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {role == 'ADMIN' &&
            <TouchableOpacity style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="person-add" color="#4CAF50" size={20} />
              <Text style={styles.buttonText}>
                Add Participant
              </Text>
            </TouchableOpacity>}
        </View>
        {role == "ADMIN"
          ?
          <>
            <FlatList
              data={project.membres}
              renderItem={renderMember}
              keyExtractor={(item) => item.idUser.toString()}
              style={styles.memberList}
            />
          </>
          : <FlatList
            data={project.membres}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.idUser.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />}
        
        
        <Modal visible={showAddModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Member</Text>
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
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
  addParticipantText: {
    marginLeft: 10,
    color: 'blue',
    fontSize: 16,
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
});
export default ProjectDetails

