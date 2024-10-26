import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Données d'exemple pour les membres actuels du groupe
const initialMembers = [
  { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', photo: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', photo: 'https://randomuser.me/api/portraits/women/2.jpg' },
];

// Données d'exemple pour les utilisateurs qui peuvent être ajoutés
const availableUsers = [
  { id: '3', nom: 'Lefebvre', prenom: 'Pierre', email: 'pierre.lefebvre@email.com', photo: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', nom: 'Dubois', prenom: 'Marie', email: 'marie.dubois@email.com', photo: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', nom: 'Roux', prenom: 'Luc', email: 'luc.roux@email.com', photo: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: '6', nom: 'Moreau', prenom: 'Emma', email: 'emma.moreau@email.com', photo: 'https://randomuser.me/api/portraits/women/6.jpg' },
];

const GroupePage = () => {
  const [groupName, setGroupName] = useState("Groupe de Projet A");
  const [members, setMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const onDeleteMember = (memberToDelete) => {
    setMembers(members.filter(member => member.id !== memberToDelete.id));
  };

  const onAddMember = (newMember) => {
    setMembers([...members, newMember]);
    setShowAddModal(false);
  };

  const onLeaveGroup = () => {
    alert("Vous avez quitté le groupe");
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.photo }} style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.prenom} ${item.nom}`}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setSelectedMember(item);
          setShowDeleteModal(true);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderAvailableUser = ({ item }) => (
    <TouchableOpacity style={styles.availableUserItem} onPress={() => onAddMember(item)}>
      <Image source={{ uri: item.photo }} style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.prenom} ${item.nom}`}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.groupTitle}>{groupName}</Text>

      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        style={styles.memberList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.buttonText}>Ajouter un membre</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.leaveButton} onPress={onLeaveGroup}>
        <Text style={styles.buttonText}>Quitter le groupe</Text>
      </TouchableOpacity>

      {/* Modal de confirmation de suppression */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer ce membre ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  onDeleteMember(selectedMember);
                  setShowDeleteModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal d'ajout de membre */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un membre</Text>
            <FlatList
              data={availableUsers}
              renderItem={renderAvailableUser}
              keyExtractor={(item) => item.id}
              style={styles.availableUserList}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  leaveButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
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
});

export default GroupePage;