import { StyleSheet,View,TextInput,Button } from 'react-native'
import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editProject, fetchProject } from '../../redux/actions/actionProject';

const UpdateProject = ({navigation,route}) => {
   const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    let idProject = route.params.idProject
    const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let token = user.token;
        const result = await dispatch(fetchProject(token, idProject));
        setTitle(result.title)
        setDescription(result.description)
        // Faites quelque chose avec profileData ici
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [])
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const project = {
                        idProject,
                        title,
                        description,
                    };
                    const result = await dispatch(editProject(token, project));
                    navigation.navigate("Signets")
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
    const dispatch = useDispatch();
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
            <Button title="Update Project" onPress={handleSubmit} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent:"center"
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
export default UpdateProject