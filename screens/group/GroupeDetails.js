import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, 
View, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { addUserToGroupe, deleteUserFromGroupe, fetchGroup, getPossibleUser } from '../../redux/actions/actionGroupe';

const GroupeDetails = ({ navigation, route }) => {
  const [groupe, setGroupe] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [token,setToken] = useState(null);
  const [userToAdd,setUserToAdd]= useState([]);
  let idGroupe = route.params.idGroupe
  const openDeleteModal = (participant) => {
    setSelectedParticipant(participant);
    setDeleteModalVisible(true);
  };
  const deleteParticipant = async() => {
    // Dispatch action to delete participant
    console.log("selectedidUser:  "+selectedParticipant.idUser)
   let deleteUser = await dispatch(deleteUserFromGroupe(token,groupe.idGroupe,selectedParticipant.idUser));
    setDeleteModalVisible(false);
    load();
  };
  const addParticipant = async(user) => {
    console.log('user: '+JSON.stringify(user))
    let addUser = await dispatch(addUserToGroupe(token,groupe.idGroupe,user.idUser))
    setAddModalVisible(false);
    load();
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
          <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer ce membre ?</Text>
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
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const renderAddModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => setAddModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalViewParticipant}>
          <Text style={styles.titleModal}>select user </Text>
          {<FlatList
            data={userToAdd}
            renderItem={({ item }) => (
              <View style={styles.participantItem2}>
              <TouchableOpacity style={styles.userItem} onPress={() => addParticipant(item)}>
                <Text>{item.firstName} {item.LastName}</Text>
              </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.idUser.toString()}
          />
          }
          <TouchableOpacity
            style={[styles.button, styles.buttonCancelModal]}
            onPress={() => setAddModalVisible(false)}
          >
            <Text style={styles.textStyle}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        const result = await dispatch(fetchGroup(tokens, idGroupe));
        setGroupe(result);
       // console.log("idEvent: "+result.idEvent);
        const result2 = await dispatch(getPossibleUser(token,result.idGroupe))
        console.log("result2: "+result2)
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
  useEffect(() => {
    load();
  }, [])
    const renderFooter = () => (
    <TouchableOpacity
      style={styles.addParticipantButton}
      onPress={() => setAddModalVisible(true)
      }
    >
      <MaterialIcons name="person-add" size={24} color="blue" />
      <Text style={styles.addParticipantText}>Add participant</Text>
    </TouchableOpacity>
  );
  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <Text>{item.firstName} {item.lastName}</Text>
      <TouchableOpacity onPress={() => openDeleteModal(item)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
  } else {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>{groupe.label}</Text>
        <View style={styles.bioContainer}>
 
          <Text style={styles.participantsTitle}>Membres :</Text>
          <FlatList
            data={groupe.membres}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.idUser.toString()}
            ListFooterComponent={renderFooter}
          />
        </View>
        {renderDeleteModal()}
        {renderAddModal()}
      </ScrollView>
    )
  }
}


export default GroupeDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  valueText: {
    fontSize: 15,
    marginTop: 10,
  },
  bioContainer: {
    padding: 15,
  },
  bioText: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 60,
    marginTop: 10
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  participantItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
    participantItem2: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  modalViewParticipant: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    width:"70%",
    height:"70%",
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
  userItem: {
    padding: 5
  },
  buttonCancelModal: {
    marginTop:15,
    backgroundColor: "#2196F3",
  },
  titleModal:{
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
     fontWeight: 'bold',
  }
})