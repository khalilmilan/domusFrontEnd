import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchGroups } from '../redux/actions/actionGroupe';
import GroupeItem from '../components/groupe/GroupeItem';
  
const Sujets = ({navigation,route}) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();  
    const AddGroupe = () => { 
        navigation.navigate("AddGroupe")  
    }
    const load= async() => {
        // Fonction pour récupérer l'ID de l'utilisateur depuis AsyncStorage
        const getUserIdFromStorage = async () => {
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
                let user = JSON.parse(userDetails);
                setToken(user.token);
                let idUser = user.userId;
                setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
                const result = await dispatch(fetchGroups(token, idUser));
                setGroups(result);
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
        
    if (loading) {
        return <Text>Chargement groups...</Text>;
    }

    
    return (
        <View style={styles.container}>
            <View styles={styles.header}>
            <Text style={styles.pageTitle}>My Groups</Text>
            <TouchableOpacity
                style={styles.addParticipantButton}
             onPress={() => AddGroupe() }
            >
                <MaterialIcons name="add" size={24} color="blue" />
                <Text style={styles.addParticipantText}>Add Group</Text>
            </TouchableOpacity> 
            </View>
            <FlatList
                data={groups}
                renderItem={({ item }) => <GroupeItem groupe={item} token={token}/>}
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
    header:{
        flexDirection:"row-reverse"
    }
});

export default Sujets


