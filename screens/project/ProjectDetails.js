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

const ProjectDetails = ({ navigation, route }) => {
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState();
  const [tickets,setTickets] = useState();
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
        if(user.role=="ADMIN"){
          setTickets(result.tickets)
        }else{
          const ticketsParticipant = result.tickets.filter(t => t.userAffectedTo.idUser == user.userId);
          setTickets(ticketsParticipant)
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
  const addParticipant=async(item)=>{
    let addUser = await dispatch(addUserToProject(token,project.idProject,item.idUser));
    load();
    setShowAddModal(false)
  }
    const deleteParticipant = async() => {
   let deleteUser = await dispatch(deleteUserFromProject(token,project.idProject,selectedParticipant.idUser));
    load();
    setDeleteModalVisible(false);
  };
  const deleteForums = async()=>{
    try{
    //let deletedForum= await dispatch(deleteForumById(token, selectedForumId));
    }catch(error){
        console.log("error delete: "+error)
    }
    load();
    setDeleteForumModalVisible(false);
  }
  const renderForumFooter = () => {
    return role === 'ADMIN' ?(
    <TouchableOpacity
      style={styles.addParticipantButton}
      onPress={() => { navigation.navigate('AddTicket', {idProject: project.idProject,loadProjectDetails:load })}
      }
    >
      <MaterialIcons name="add" size={24} color="blue" />
      <Text style={styles.addParticipantText}>Add Ticket</Text>
    </TouchableOpacity>
    ):null
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
          <Text style={styles.modalText}>Are you sure you want to delete this member?</Text>
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
  const renderTicket = ({ item }) => (
    <TouchableOpacity 
    onPress={()=>navigation.navigate('TicketDetails',{ idTicket:item.idTicket,idProject:item.idProject })}
    style={[styles.ticketItem, { backgroundColor: getStatusColor(item.status)}]}
    >
      <Text style={styles.ticketTitle}>{item.title}</Text>
      {item.userAffectedTo.idUser==null? 
      <><Text style={styles.ticketStatusValue}>NOT AFFECTED</Text></> : 
      <View style={styles.availableUserItem}>
      <Image
        source={
          item.userAffectedTo.photo
            ? { uri: item.userAffectedTo.photo }
            : item.userAffectedTo.gender === 'MALE'
              ? require('../../assets/avatar0.png')
              : require('../../assets/avatar2.png')
        }
        style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.userAffectedTo.firstName} ${item.userAffectedTo.lastName}`}</Text>
        <Text style={styles.memberEmail}>{item.userAffectedTo.email}</Text>
      </View>
    </View>}
      <Text style={styles.ticketStatus}> status: <Text style={styles.ticketStatusValue}>{item.status==1?"To do": item.status==2?"In progress":"Finished"}</Text></Text>
    </TouchableOpacity>
  );
  const openDeleteModal = (participant) => {
    setSelectedParticipant(participant);
    setDeleteModalVisible(true);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return '#FFA07A';
      case 2: return '#98FB98';
      case 3: return '#87CEFA';
      default: return '#FFFFFF';
    }
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
          <Text style={styles.dateText}>Début: {project.startDate}</Text>
          <Text style={styles.dateText}>Fin: {project.endDate}</Text>
        </View>
        <Text style={styles.sectionTitle}>Participants</Text>
        {role=="ADMIN"
        ?
        <>
        <FlatList
            data={project.membres}
            renderItem={renderMember}
            keyExtractor={(item) => item.idUser.toString()}
            style={styles.memberList}
          />
            <TouchableOpacity style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="person-add" color="white" size={20} />
              <Text style={styles.buttonText}>
                Add Member
              </Text>
            </TouchableOpacity>
        </>
        :<FlatList
          data={project.membres}
          renderItem={renderParticipant}
          keyExtractor={(item) => item.idUser.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />}
        <Text style={styles.sectionTitle}>Tickets</Text>
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.idTicket.toString()}
          style={styles.ticketList}
          ListFooterComponent={ renderForumFooter()}
        />
        {role=="ADMIN"&&<>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'left',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  ticketStatusValue:{
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
});
export default ProjectDetails

