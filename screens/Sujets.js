import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchGroups, fetchMembreGroups } from '../redux/actions/actionGroupe';
import GroupeItem from '../components/groupe/GroupeItem';

const Sujets = ({ navigation, route }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState();
    const [filteredGroups, setFilteredGroups] = useState([]);
    const dispatch = useDispatch();
    const [orderByName, setOrderByName] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderByMember, setOrderByMember] = useState()

    const AddGroupe = () => {
        navigation.navigate("AddGroupe", { loadList: getUserIdFromStorage })
    }
    const getUserIdFromStorage = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
            let user = JSON.parse(userDetails);
            setToken(user.token);
            setRole(user.role);
            let idUser = user.userId;
            setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
            if (user.role == "ADMIN") {
                const result = await dispatch(fetchGroups(token, idUser));
                setGroups(result);
                setFilteredGroups(result)
            } else {
                const result = await dispatch(fetchMembreGroups(token, idUser));
                setGroups(result);
                setFilteredGroups(result)
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID', error);
        }
        finally {
            setLoading(false);
        }
    };
    const load = async () => {
        getUserIdFromStorage();  // Appelle la fonction pour récupérer l'ID
    };
    useEffect(() => {
        load();
    }, [userId])
    const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = groups.filter(group =>
      group.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const toggleOrderByName = () => {
    setOrderByName(!orderByName);
    const sorted = [...filteredGroups].sort((a, b) => orderByName 
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label)
    );
    setFilteredGroups(sorted);
  };
    const toggleOrderByMember = () => {
    setOrderByMember(!orderByMember);
    const sorted = [...filteredGroups].sort((a, b) => orderByMember 
      ? b.membres.length - a.membres.length
      : a.membres.length - b.membres.length
    );
    setFilteredGroups(sorted);
  };
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    }
    return (
        <View style={styles.container}>
            <View styles={styles.header}>
                <Text style={styles.pageTitle}>My Groups</Text>
                {role == "ADMIN" && <TouchableOpacity
                    style={styles.addParticipantButton}
                    onPress={() => AddGroupe()}
                >
                    <MaterialIcons name="add" size={24} color="blue" />
                    <Text style={styles.addParticipantText}>Add Group</Text>
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
                <View style={styles.filterButtons}>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByMember}>
                        <Text style={styles.filterButtonText}>Sort by member</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleOrderByName}>
                        <Text style={styles.filterButtonText}>Sort by Label</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredGroups}
                renderItem={({ item }) => <GroupeItem groupe={item} token={token} role={role} loadListGroupe={load} />}
                keyExtractor={(item) => item.idGroupe.toString()}
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
        color: '#007bff',
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
});

export default Sujets


