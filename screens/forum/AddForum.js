import { StyleSheet, Text, View,TextInput,Button } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addForum } from '../../redux/actions/actionForum';

const AddForum = ({navigation, route}) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    let idEvent=route.params.eventId;
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    let idUser = user.userId
                    console.log("userId: "+user.userId)
                    const forum = {
                        title,
                        idUser,
                        description,
                        idEvent
                        
                    };
                    const uiUpdate = await dispatch(addForum(token, forum));
                    navigation.navigate('EventDetails', { eventId: idEvent })
                    // Faites quelque chose avec profileData ici
                } else {
                    console.log("No user details found in AsyncStorage");
                }
            } catch (error) {
                console.error("Error in load function:", error);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
        }
    };
  return (
    <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="description"
                multiline={true}
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
            />
            <Button title="Add Forum" onPress={handleSubmit} />
        </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,     
        justifyContent: "center",
    },

    
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
});
export default AddForum

