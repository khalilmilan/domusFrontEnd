import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const eventData = {
  title: "Conférence sur la Technologie",
  description: "Rejoignez-nous pour une conférence passionnante sur les dernières avancées technologiques.",
  date: "2024-11-15T10:00:00Z",
  participants: [
    {
      id: 1,
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice.dupont@example.com",
      response: "Accepté",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Martin",
      email: "bob.martin@example.com",
      response: "Refusé",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    // Autres participants...
  ],
};

const availableGuests = [
  {
    id: 5,
    firstName: "Élise",
    lastName: "Benoit",
    email: "elise.benoit@example.com",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  // Autres invités disponibles...
];

const EventDetailsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newParticipant, setNewParticipant] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleAddGuest = () => {
    if (newParticipant) {
      eventData.participants.push(newParticipant);
      setNewParticipant(null);
      setModalVisible(false);
      Alert.alert("Participant ajouté", `${newParticipant.firstName} ${newParticipant.lastName} a été ajouté.`);
    } else {
      Alert.alert("Erreur", "Veuillez sélectionner un participant à ajouter.");
    }
  };

  const handleRemoveParticipants = () => {
    const updatedParticipants = eventData.participants.filter(participant => !selectedParticipants.includes(participant.id));
    eventData.participants = updatedParticipants;
    setSelectedParticipants([]); // Réinitialiser la sélection
    Alert.alert("Participants supprimés", "Les participants sélectionnés ont été supprimés avec succès.");
  };

  const toggleSelection = (participantId) => {
    if (selectedParticipants.includes(participantId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
    } else {
      setSelectedParticipants([...selectedParticipants, participantId]);
    }
  };

  const renderParticipant = ({ item }) => (
    <View style={[styles.participantItem, { backgroundColor: getResponseColor(item.response) }]}>
      <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.checkbox}>
        {selectedParticipants.includes(item.id) ? (
          <Ionicons name="checkbox" size={24} color="#0984e3" />
        ) : (
          <Ionicons name="checkbox-outline" size={24} color="#888" />
        )}
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.participantImage} />
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.participantEmail}>{item.email}</Text>
        <Text style={styles.participantResponse}>{item.response}</Text>
      </View>
    </View>
  );

  const getResponseColor = (response) => {
    switch (response) {
      case 'Accepté':
        return '#d4edda';
      case 'Refusé':
        return '#f8d7da';
      case 'Peut-être':
        return '#fff3cd';
      default:
        return '#ffffff';
    }
  };

  const renderAvailableGuest = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setNewParticipant(item);
      Alert.alert("Participant sélectionné", `${item.firstName} ${item.lastName} sera ajouté.`);
    }}>
      <View style={styles.guestItem}>
        <Image source={{ uri: item.image }} style={styles.guestImage} />
        <Text style={styles.guestName}>{item.firstName} {item.lastName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{eventData.title}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{eventData.description}</Text>
      <Text style={styles.date}>Date: {new Date(eventData.date).toLocaleString()}</Text>

      <Text style={styles.participantHeader}>Participants:</Text>
      <FlatList
        data={eventData.participants}
        renderItem={renderParticipant}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.participantList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Ajouter un participant</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.removeButton} onPress={handleRemoveParticipants} disabled={selectedParticipants.length === 0}>
        <Text style={styles.removeButtonText}>Supprimer les participants sélectionnés</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forumLink} onPress={() => navigation.navigate('Forums')}>
        <Text style={styles.forumLinkText}>Forums</Text>
      </TouchableOpacity>

      {/* Modal pour ajouter un participant */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionner un participant</Text>
            <FlatList
              data={availableGuests}
              keyExtractor={item => item.id.toString()}
              renderItem={renderAvailableGuest}
              contentContainerStyle={styles.guestList}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddGuest}>
              <Text style={styles.modalButtonText}>Ajouter ce participant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0984e3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  participantHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  participantList: {
    paddingBottom: 20,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontWeight: 'bold',
  },
  participantEmail: {
    fontSize: 12,
    color: '#666',
  },
  participantResponse: {
    fontSize: 12,
    color: '#666',
  },
  checkbox: {
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#00b894',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#d63031',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forumLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  forumLinkText: {
    color: '#0984e3',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  guestList: {
    width: '100%',
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  guestImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  guestName: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#00b894',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventDetailsScreen;
