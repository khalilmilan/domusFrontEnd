import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

// Exemples d'événements
const initialEvents = [
  { id: 1, name: 'Concert de Jazz', date: new Date('2023-10-15') },
  { id: 2, name: 'Conférence Tech', date: new Date('2024-01-12') },
  { id: 3, name: 'Exposition d’Art', date: new Date('2023-09-25') },
  { id: 4, name: 'Festival de Cinéma', date: new Date('2024-02-20') },
  { id: 5, name: 'Atelier de Peinture', date: new Date('2023-11-05') },
];

const EventsPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTimeFilter, setEventTimeFilter] = useState('all'); // 'past' or 'future' or 'all'
  const [orderByDate, setOrderByDate] = useState(false);
  const [orderByName, setOrderByName] = useState(false);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = events.filter(event =>
      event.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleDateChange = (event, selectedDate) => {
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const filtered = events.filter(event => 
        event.date.toDateString() === selectedDate.toDateString()
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  };

  const filterEventsByTime = (timeFilter) => {
    setEventTimeFilter(timeFilter);
    const today = new Date();
    let filtered = events;

    if (timeFilter === 'past') {
      filtered = events.filter(event => event.date < today);
    } else if (timeFilter === 'future') {
      filtered = events.filter(event => event.date > today);
    }
    
    setFilteredEvents(filtered);
  };

  const toggleOrderByDate = () => {
    setOrderByDate(!orderByDate);
    const sorted = [...filteredEvents].sort((a, b) => orderByDate 
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
    );
    setFilteredEvents(sorted);
  };

  const toggleOrderByName = () => {
    setOrderByName(!orderByName);
    const sorted = [...filteredEvents].sort((a, b) => orderByName 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
    );
    setFilteredEvents(sorted);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Filtres */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom d'événement"
          value={searchTerm}
          onChangeText={handleSearch}
        />

        <View style={styles.datePickerContainer}>
          <MaterialIcons name="date-range" size={24} color="black" />
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>

        {/* Radio Buttons for Event Time Filters */}
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => filterEventsByTime('past')}
          >
            <View style={styles.radioCircle}>
              {eventTimeFilter === 'past' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Événements passés</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => filterEventsByTime('future')}
          >
            <View style={styles.radioCircle}>
              {eventTimeFilter === 'future' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Événements futurs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByDate}>
            <Text style={styles.filterButtonText}>Trier par date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByName}>
            <Text style={styles.filterButtonText}>Trier par nom</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des événements */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date.toDateString()}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
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
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventsPage;
