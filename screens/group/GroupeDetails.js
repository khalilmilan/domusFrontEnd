

import {
  View, Text, Image, ActivityIndicator, TouchableOpacity,
  FlatList, Modal, StyleSheet, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUserToGroupe, deleteUserFromGroupe, fetchGroup, getPossibleUser, leaveGroupe } from '../../redux/actions/actionGroupe';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Button,
    Icon,
    BottomSheet,
    Divider
} from '@rneui/themed';
import { THEME_COLOR } from '../../constants';

// Données d'exemple pour les utilisateurs qui peuvent être ajoutés
const GroupeDetails = ({ navigation, route }) => {
  const [groupe, setGroupe] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState()
  const [userToAdd, setUserToAdd] = useState([]);
  let idGroupe = route.params.idGroupe
  let loadListGroupe = route.params.loadListGroupe;
  const [groupName, setGroupName] = useState("Groupe de Projet A");
  const [members, setMembers] = useState();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [idUser, setIdUser] = useState();
  const onDeleteMember = async (memberToDelete) => {
    let deleteUser = await dispatch(deleteUserFromGroupe(token, groupe.idGroupe, memberToDelete.idUser));
    load();
  };
  const onLeaveGroupe = async () => {
    let deleteUser = await dispatch(leaveGroupe(token, groupe.idGroupe, idUser));
    loadListGroupe();
    navigation.navigate('Sujets')
  }

  const onAddMember = async (user) => {
    let addUser = await dispatch(addUserToGroupe(token, groupe.idGroupe, user.idUser))
    load();
    setShowAddModal(false);
  };
  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
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
      {role == "ADMIN" &&
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setSelectedMember(item);
            setShowDeleteModal(true);
          }}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      }
    </View>
  );

  const renderAvailableUser = ({ item }) => (
    <TouchableOpacity style={styles.availableUserItem} onPress={() => onAddMember(item)}>
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
  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        setRole(user.role)
        setIdUser(user.userId)
        const result = await dispatch(fetchGroup(tokens, idGroupe));
        setGroupe(result);
        setGroupName(result.label)
        setMembers(result.membres)
        const result2 = await dispatch(getPossibleUser(token, result.idGroupe))
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
  }, [role])
  if (loading) {
    return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.groupTitle}>{groupName}</Text>
        <View style={styles.headerGuest}>
          <Text style={styles.sectionTitle}>Members</Text>
          {role == 'ADMIN' &&
            <TouchableOpacity style={styles.addButton}
              onPress={() => setShowAddModal(true)}>
              <MaterialIcons name="person-add" color="#4CAF50" size={20} />
              <Text style={styles.buttonText}>
                Add member
              </Text>
            </TouchableOpacity>}
        </View>
        <FlatList
          data={groupe.membres}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          style={styles.memberList}
        />

        {role == "USER" &&
          <TouchableOpacity style={styles.leaveButton} onPress={() => setShowLeaveModal(true)}>
            <Text style={styles.buttonText}>Leave group</Text>
          </TouchableOpacity>
        }
        {/* Modal de confirmation de suppression */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
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
                {selectedMember != null && `Are you sure you want to delete ${selectedMember.firstName}?`}
              </Text>
              <View style={styles.buttonDeleteContainer}>
                <TouchableOpacity style={styles.cancelDeleteButton} 
                onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.buttonDeleteTextModal}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmDeleteButton}
                  onPress={() => {
                    onDeleteMember(selectedMember);
                    setShowDeleteModal(false);
                  }}
                >
                  <Text style={styles.buttonTextModalDelete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal de confirmation de quitter le groupe */}
        <Modal visible={showLeaveModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to leave this groupe?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLeaveModal(false)}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => {
                    onLeaveGroupe();
                    setShowDeleteModal(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={showAddModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add membre</Text>
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
      </SafeAreaView>
    )
  }
}


export default GroupeDetails
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    padding: 15,
    color: THEME_COLOR
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
  leaveButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: "60%",
    alignSelf: "center",
    marginBottom: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  availableUserList: {
    width: '100%',
  },
  availableUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  headerGuest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: THEME_COLOR,
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
});
