import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEvents } from '../../redux/actions/actionEvent';
import EventItem from '../../components/event/EventItem'
import { MaterialIcons } from '@expo/vector-icons';

const Listes = ({navigation,route}) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const addEvent = () => {
        navigation.navigate("AddEvent")
    }
    useEffect(() => {
        // Fonction pour récupérer l'ID de l'utilisateur depuis AsyncStorage
        const getUserIdFromStorage = async () => {
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
                let user = JSON.parse(userDetails);
                setToken(user.token);
                let idUser = user.userId;
                if (idUser) {
                    setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID', error);
            }
        };
        getUserIdFromStorage();  // Appelle la fonction pour récupérer l'ID
    }, []);
    useEffect(() => {
        dispatch(fetchEvents(token, userId));
    }, [dispatch, userId]);
    const events = useSelector(state => state.events.list);
    const loading = useSelector(state => state.events.loading);
    const error = useSelector(state => state.events.error);

    if (loading) {
        return <Text>Chargement events...</Text>;
    }

    if (error) {
        return <Text>Error : {error}</Text>;
    }
    return (
        <View style={styles.container}>
            <View styles={styles.header}>
            <Text style={styles.pageTitle}>My Events</Text>
            <TouchableOpacity
                style={styles.addParticipantButton}
             onPress={() => addEvent() }
            >
                <MaterialIcons name="add" size={24} color="blue" />
                <Text style={styles.addParticipantText}>Add Event</Text>
            </TouchableOpacity>
            </View>
            <FlatList
                data={events}
                renderItem={({ item }) => <EventItem event={item} token={token}/>}
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
    header:{
        flexDirection:"row-reverse"
    }
});
export default Listes
