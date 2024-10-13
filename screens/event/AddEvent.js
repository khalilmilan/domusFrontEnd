import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEvent } from '../../redux/actions/actionEvent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddEvent = ({navigation,routes}) => {
    const [label, setLabel] = useState('');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('')
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    let idUser = user.userId
                    const eventUpdate = {
                        label,
                        idUser,
                        description,
                        date
                    };
                    const uiUpdate = await dispatch(addEvent(token, eventUpdate));
                    navigation.navigate('Listes')
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

    const showDatepicker = () => {
        setShow(true);
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const dispatch = useDispatch();
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="label"
                value={label}
                onChangeText={setLabel}
            />
            <TextInput
                style={styles.input}
                placeholder="description"
                multiline={true}
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
            />
            <View style={styles.containerDate}>
                <View style={styles.dateContainer}>
                    <Text>Date : </Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.button}>
                        <Text style={styles.buttonText}>Choisir une date</Text>
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(date)} 
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>

            <Button title="Add Event" onPress={handleSubmit} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
export default AddEvent