import React, { useState } from 'react';
import { View, Modal, Text, TextInput, FlatList, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';

const usersData = [
  { id: '1', firstname: 'Alice', lastname: 'Smith', email: 'alice@example.com', photo: 'https://via.placeholder.com/40' },
  { id: '2', firstname: 'Bob', lastname: 'Johnson', email: 'bob@example.com', photo: 'https://via.placeholder.com/40' },
  { id: '3', firstname: 'Charlie', lastname: 'Brown', email: 'charlie@example.com', photo: 'https://via.placeholder.com/40' },
  // Ajouter plus d'utilisateurs ici
];

const NewDiscussionModal = () => {
  const [modalVisible, setModalVisible] = useState(false); // État pour contrôler la visibilité du modal
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(usersData);

  const handleUserSearch = (text) => {
    setUsername(text);
    if (text) {
      setFilteredUsers(
        usersData.filter((user) =>
          (user.firstname + ' ' + user.lastname).toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(usersData);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUsername(user.firstname + ' ' + user.lastname);
    setFilteredUsers([]);
  };

  const handleCreateDiscussion = () => {
    // Logique pour créer la discussion avec `selectedUser`
    console.log("Nouvelle discussion avec :", selectedUser);
    setModalVisible(false); // Fermer le modal après la création
  };

  return (
    <View style={styles.container}>
      {/* Bouton pour ouvrir le modal */}
      <Button title="Nouvelle discussion" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nouvelle Discussion</Text>
            <TextInput
              style={styles.input}
              placeholder="Rechercher un utilisateur"
              value={username}
              onChangeText={handleUserSearch}
            />
            {filteredUsers.length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                    <Image source={{ uri: item.photo }} style={styles.userPhoto} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.firstname} {item.lastname}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateDiscussion}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewDiscussionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    width: '100%',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
