import React, { useState, useEffect } from 'react';
import {
    View, Text,
    FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator
} from 'react-native';
import {useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEvents, fetchParticipantEvent } from '../../redux/actions/actionEvent';
import EventItem from '../../components/event/EventItem'
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formedate } from '../../.expo/utils/formatDate';

const Listes = ({ navigation, route }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState();
    const [events, setEvents] = useState()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTimeFilter, setEventTimeFilter] = useState('all');
    const [orderByDate, setOrderByDate] = useState(false);
    const [orderByName, setOrderByName] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const addEvent = () => {
        navigation.navigate("AddEvent", { loadList: getEvents })
    }
    const getUserIdFromStorage = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
            let user = JSON.parse(userDetails);
            setToken(user.token);
            setRole(user.role);
            let idUser = user.userId;
            setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
            if (role == "ADMIN") {
                let result = await dispatch(fetchEvents(token, userId));
                setEvents(result);
                setFilteredEvents(result)
            } else {
                let result = await dispatch(fetchParticipantEvent(token, userId));
                setEvents(result);
                setFilteredEvents(result)
            }
            setEvents(result);

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        getUserIdFromStorage();
    }, [userId]);
    const handleSearch = (text) => {
        setSearchTerm(text);
        const filtered = events.filter(event =>
            event.label.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const handleDateChange = (event, selectedDate) => {
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const filtered = events.filter(event =>
                Formedate(event.date) === Formedate(selectedDate)
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
            filtered = events.filter(event => new Date(event.date) < today);
        } else if (timeFilter === 'future') {
            filtered = events.filter(event => new Date(event.date) > today);
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
            ? a.label.localeCompare(b.label)
            : b.label.localeCompare(a.label)
        );
        setFilteredEvents(sorted);
    };

    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);
    }
    return (
        <View style={styles.container}>
            <View styles={styles.header}>
                <Text style={styles.pageTitle}>My Events</Text>
                {role == "ADMIN"
                    &&
                    <TouchableOpacity
                        style={styles.addParticipantButton}
                        onPress={() => addEvent()}
                    >
                        <MaterialIcons name="add" size={24} color="blue" />
                        <Text style={styles.addParticipantText}>Add Event</Text>
                    </TouchableOpacity>}

            </View>
            <View style={styles.filterContainer}>
                <Text style={styles.sectionTitle}>Filter</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Label"
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
                        <Text style={styles.radioText}>Past Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => filterEventsByTime('future')}
                    >
                        <View style={styles.radioCircle}>
                            {eventTimeFilter === 'future' && <View style={styles.selectedRb} />}
                        </View>
                        <Text style={styles.radioText}>Future Events</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.filterButtons}>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByDate}>
                        <Text style={styles.filterButtonText}>Sort by date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByName}>
                        <Text style={styles.filterButtonText}>Sort by Label</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredEvents}
                renderItem={({ item }) =>
                    <EventItem event={item} token={token} role={role} loadList={getUserIdFromStorage} />}
                keyExtractor={(item) => item.idEvent.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    evenItem: {
        backgroundColor: 'white',
    },
    oddItem: {
        backgroundColor: '#e6e6e6',
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        height: 5,
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
    header: {
        flexDirection: "row-reverse"
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007bff',
    },
});
export default Listes
