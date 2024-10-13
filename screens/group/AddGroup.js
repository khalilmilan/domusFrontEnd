import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addGroup } from '../../redux/actions/actionGroupe';

const AddGroup = ({navigation,routes}) => {
    const [label, setLabel] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    let idUser = user.userId
                    const groupe = {
                        label,
                        idUser
                    };
                    const uiUpdate = await dispatch(addGroup(token, groupe));
                    navigation.navigate('Sujets')
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
                placeholder="label"
                value={label}
                onChangeText={setLabel}
            />

            <Button title="Add Groupe" onPress={handleSubmit} />
        </View>
    );
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
});
export default AddGroup

