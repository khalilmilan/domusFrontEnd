import { StyleSheet, Text, View,TextInput,Button } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateForumm } from '../../redux/actions/actionForum';

const UpdateForum = ({navigation,route}) => {
   const dispatch = useDispatch();
   let forum=route.params.forum;
    console.log('forum: '+forum);
    const [title, setTitle] = useState(forum.title);
    const [description, setDescription] = useState(forum.description);
    
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const updateForum = {
                        ...forum,
                        title,
                        description   
                    };
                    console.log(updateForum)
                    const uiUpdate = await dispatch(updateForumm(token, updateForum));
                   // navigation.navigate('ForumDetauls', { eventId: updateForum.idForum })
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
            <Button title="Update Forum" onPress={handleSubmit} />
        </View>
  )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,     
        flex: 1,
        justifyContent: "center",
    },
    photoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    containerDate: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
    dateText: {
        fontSize: 16,
        marginLeft: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    radioText: {
        fontSize: 16,
    },
});
export default UpdateForum