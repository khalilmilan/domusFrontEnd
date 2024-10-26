import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addGroup } from '../../redux/actions/actionGroupe';

const AddGroup = ({navigation,route}) => {
    const [label, setLabel] = useState('');
    const dispatch = useDispatch();
    let loadListGroupe = route.params.loadList
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
                    loadListGroupe();
                    navigation.navigate('Sujets')
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
    const isFormValid = label;
    return (
       <View style={styles.container}>
            <Text style={styles.pageTitle}>Add Groupe</Text>
            <View style={styles.fieldset}>
                <Text style={styles.legend}>Groupe Détails </Text>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Label</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez un label"
                        value={label}
                        onChangeText={setLabel}
                        placeholderTextColor="#888"
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.submitButton}
                onPress={handleSubmit}
                disabled={!isFormValid}
            >
                <Text style={styles.submitButtonText}>Add Groupe</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f4f6f9', // Couleur douce pour le fond
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    fieldset: {
        padding: 15,
        borderColor: '#007bff', // Bordure bleue
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    legend: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#007bff',
    },
    field: {
        marginBottom: 20,
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#e9ecef', // Légèrement coloré pour les champs
        color: '#333', // Texte dans les champs
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333', // Couleur du texte de la date
    },
    datePicker: {
        marginTop: 20, // Corrige la position du DatePicker
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
export default AddGroup

