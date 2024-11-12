import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Button, 
  ListItem, 
  BottomSheet,
  SearchBar,
  Chip,
  Icon,
  Overlay
} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

// Données de démonstration
const initialEvents = [
  { id: 1, label: 'Réunion d\'équipe', date: new Date(2024, 10, 15), creator: 'Jean Dupont' },
  { id: 2, label: 'Conférence Dev', date: new Date(2024, 10, 20), creator: 'Marie Martin' },
  { id: 3, label: 'Workshop React', date: new Date(2024, 11, 5), creator: 'Paul Bernard' },
];

const EventsListScreen = () => {
  const [events, setEvents] = useState(initialEvents);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(true);
  const [sortByLabel, setSortByLabel] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Gestion des filtres
  const applyFilters = () => {
    let filteredEvents = [...initialEvents];
    const filters = [];

    if (searchText) {
      filteredEvents = filteredEvents.filter(event => 
        event.label.toLowerCase().includes(searchText.toLowerCase())
      );
      filters.push({ type: 'search', value: searchText });
    }

    if (filterDate) {
      filteredEvents = filteredEvents.filter(event => 
        format(event.date, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd')
      );
      filters.push({ type: 'date', value: format(filterDate, 'dd/MM/yyyy') });
    }

    if (!showPastEvents) {
      filteredEvents = filteredEvents.filter(event => event.date >= new Date());
      filters.push({ type: 'future', value: 'Événements futurs uniquement' });
    }

    if (sortByLabel) {
      filteredEvents.sort((a, b) => a.label.localeCompare(b.label));
      filters.push({ type: 'sort', value: 'Tri alphabétique' });
    }

    if (sortByDate) {
      filteredEvents.sort((a, b) => a.date - b.date);
      filters.push({ type: 'sort', value: 'Tri par date' });
    }

    setEvents(filteredEvents);
    setActiveFilters(filters);
    setFilterVisible(false);
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    // Réinitialiser le filtre correspondant
    if (filterToRemove.type === 'search') setSearchText('');
    if (filterToRemove.type === 'date') setFilterDate(null);
    if (filterToRemove.type === 'future') setShowPastEvents(true);
    if (filterToRemove.type === 'sort') {
      setSortByLabel(false);
      setSortByDate(false);
    }
    applyFilters();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text h4>My Events</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => console.log('Ajouter un événement')}
          >
            <Icon name="add" color="white" />
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Icon name="filter-list" color="white" />
            <Text style={styles.buttonText}>Filtrer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chips des filtres actifs */}
      <View style={styles.chipContainer}>
        {activeFilters.map((filter, index) => (
          <Chip
            key={index}
            title={filter.value}
            onPress={() => removeFilter(filter)}
            icon={{
              name: 'close',
              type: 'ionicon',
              size: 20,
              color: 'gray',
            }}
            containerStyle={styles.chip}
          />
        ))}
      </View>

      {/* Liste des événements */}
      {events.map((event, index) => (
        <ListItem key={index} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{event.label}</ListItem.Title>
            <ListItem.Subtitle>
              {format(event.date, 'dd MMMM yyyy', { locale: fr })}
            </ListItem.Subtitle>
            <Text style={styles.creator}>Créé par: {event.creator}</Text>
          </ListItem.Content>
          <TouchableOpacity 
            onPress={() => {
              setSelectedEvent(event);
              setActionSheetVisible(true);
            }}
          >
            <Icon name="more-vert" />
          </TouchableOpacity>
        </ListItem>
      ))}

      {/* Bottom Sheet des filtres */}
      <BottomSheet
        isVisible={isFilterVisible}
        onBackdropPress={() => setFilterVisible(false)}
      >
        <View style={styles.filterSheet}>
          <Text h4 style={styles.filterTitle}>Filtres</Text>
          
          <SearchBar
            placeholder="Rechercher un événement"
            onChangeText={setSearchText}
            value={searchText}
            platform="ios"
            containerStyle={styles.searchBar}
          />

          <TouchableOpacity 
            style={styles.datePicker}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" type="font-awesome" />
            <Text style={styles.dateText}>
              {filterDate ? format(filterDate, 'dd/MM/yyyy') : 'Choisir une date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={filterDate || new Date()}
              mode="date"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setFilterDate(date);
              }}
            />
          )}

          <View style={styles.toggleContainer}>
            <Text>Afficher les événements passés</Text>
            <TouchableOpacity
              style={[
                styles.toggle,
                showPastEvents && styles.toggleActive
              ]}
              onPress={() => setShowPastEvents(!showPastEvents)}
            >
              <View style={[
                styles.toggleKnob,
                showPastEvents && styles.toggleKnobActive
              ]} />
            </TouchableOpacity>
          </View>

          <View style={styles.sortButtons}>
            <Button
              title="Tri alphabétique"
              type={sortByLabel ? "solid" : "outline"}
              onPress={() => setSortByLabel(!sortByLabel)}
            />
            <Button
              title="Tri par date"
              type={sortByDate ? "solid" : "outline"}
              onPress={() => setSortByDate(!sortByDate)}
            />
          </View>

          <Button
            title="Appliquer les filtres"
            onPress={applyFilters}
            containerStyle={styles.applyButton}
          />
        </View>
      </BottomSheet>

      {/* Bottom Sheet des actions */}
      <BottomSheet
        isVisible={isActionSheetVisible}
        onBackdropPress={() => setActionSheetVisible(false)}
      >
        <View style={styles.actionSheet}>
          <ListItem onPress={() => {
            console.log('Modifier', selectedEvent);
            setActionSheetVisible(false);
          }}>
            <Icon name="edit" />
            <ListItem.Content>
              <ListItem.Title>Modifier</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          
          <ListItem onPress={() => {
            console.log('Supprimer', selectedEvent);
            setActionSheetVisible(false);
          }}>
            <Icon name="delete" color="red" />
            <ListItem.Content>
              <ListItem.Title style={{ color: 'red' }}>Supprimer</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2089dc',
    borderRadius: 5,
    padding: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2089dc',
    borderRadius: 5,
    padding: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 5,
  },
  chip: {
    margin: 2,
  },
  creator: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  filterSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filterTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  dateText: {
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#2089dc',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 10,
  },
  applyButton: {
    marginTop: 20,
  },
  actionSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default EventsListScreen;