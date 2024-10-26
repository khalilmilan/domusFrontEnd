import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,
 TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchParticipantProjects, fetchProjects } from '../redux/actions/actionProject';
import ProjectItem from '../components/project/ProjectItem';
import DateTimePicker from '@react-native-community/datetimepicker';

const Signets = ({ navigation, route }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState()
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTimeFilter, setEventTimeFilter] = useState('all');
    const [orderByDate, setOrderByDate] = useState(false);
    const [orderByName, setOrderByName] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const AddProject = () => {
        navigation.navigate("AddProject", { loadList: load })
    }
    const load = async () => {
        const getUserIdFromStorage = async () => {
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
                let user = JSON.parse(userDetails);
                setToken(user.token);
                let idUser = user.userId;
                setRole(user.role);
                setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
                if (user.role == "ADMIN") {
                    const result = await dispatch(fetchProjects(token, idUser));
                    setProjects(result);
                    setFilteredProjects(result);
                } else {
                    const result = await dispatch(fetchParticipantProjects(token, idUser));
                    setProjects(result);
                    setFilteredProjects(result);
                }

            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID', error);
            }
            finally {
                setLoading(false);
            }
        };
        getUserIdFromStorage();  // Appelle la fonction pour récupérer l'ID
    };
    useEffect(() => {
        load();
    }, [userId])
    const handleSearch = (text) => {
        setSearchTerm(text);
        const filtered = projects.filter(project =>
            project.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProjects(filtered);
    };

    const handleDateChange = (event, selectedDate) => {
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const filtered = projects.filter(project =>
                Formedate(project.date) === Formedate(selectedDate)
            );
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects(projects);
        }
    };

    const filterEventsByTime = (timeFilter) => {
        setEventTimeFilter(timeFilter);
        const today = new Date();
        let filtered = projects;
        if (timeFilter === 'past') {
            filtered = projects.filter(project => new Date(project.endDate) < today);
        } else if (timeFilter === 'future') {
            filtered = projects.filter(project => new Date(project.startDate) > today);
        }
        setFilteredProjects(filtered);
    };

    const toggleOrderByDate = () => {
        setOrderByDate(!orderByDate);
        const sorted = [...filteredProjects].sort((a, b) => orderByDate
            ? new Date(b.startDate) - new Date(a.startDate)
            : new Date(a.startDate) - new Date(b.startDate)
        );
        setFilteredProjects(sorted);
    };

    const toggleOrderByName = () => {
        setOrderByName(!orderByName);
        const sorted = [...filteredProjects].sort((a, b) => orderByName
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
        setFilteredProjects(sorted);
    };
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);
    }
    return (
        <View style={styles.container}>
            <View styles={styles.header}>
                <Text style={styles.pageTitle}>My Projects</Text>
                {role == "ADMIN" && <TouchableOpacity
                    style={styles.addParticipantButton}
                    onPress={() => AddProject()}
                >
                    <MaterialIcons name="add" size={24} color="blue" />
                    <Text style={styles.addParticipantText}>Add Project</Text>
                </TouchableOpacity>}
            </View>
            <View style={styles.filterContainer}>
                <Text style={styles.sectionTitle}>Filter</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by title"
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
                        <Text style={styles.radioText}>Past Projects</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => filterEventsByTime('future')}
                    >
                        <View style={styles.radioCircle}>
                            {eventTimeFilter === 'future' && <View style={styles.selectedRb} />}
                        </View>
                        <Text style={styles.radioText}>Future Projects</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.filterButtons}>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByDate}>
                        <Text style={styles.filterButtonText}>Sort by start date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByName}>
                        <Text style={styles.filterButtonText}>Sort by Label</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredProjects}
                renderItem={({ item }) => <ProjectItem project={item} token={token} loadList={load} role={role} />}
                keyExtractor={(item) => item.idProject.toString()}
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

export default Signets


