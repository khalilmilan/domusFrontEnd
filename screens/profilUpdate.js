import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { UserUpdateProfil } from '../redux/actions/actionUser';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, isValid } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { Formedate } from '../.expo/utils/formatDate';
const ProfilUpdate = ({ navigation, route }) => {
    let profileData = route.params.profilData;
    let loadProfil = route.params.loadProfil;
    const [firstName, setFirstName] = useState(profileData.firstName || '');
    const [lastName, setLastName] = useState(profileData.lastName || '');
    const [email, setEmail] = useState(profileData.email || '');
    const [photo, setPhoto] = useState(profileData.photo || '');
    const [adresse, setAdress] = useState(profileData.adresse || '');
    const [birthDate, setBirthDate] = useState(profileData.birthDate || '');
    const [show, setShow] = useState(false);
    const [gender, setGender] = useState(profileData.gender);
    const [phoneNumber, setPhoneNumber] = useState(profileData.phoneNumber);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStart, setShowStart] = useState(false);
    const options = [
        { id: '1', label: 'Male', value: 'MALE' },
        { id: '2', label: 'Female', value: 'FEMELLE' },
    ];
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShow(Platform.OS === 'ios');
        setBirthDate(currentDate);
    };
    const showStartDatepicker = () => {
        setShowStart(true);
    };
    const handleChange = (text) => {
        // Optionnel : Formatage du numéro de téléphone
        const formattedText = text.replace(/[^0-9]/g, ''); // Supprime tous les caractères non numériques
        setPhoneNumber(formattedText);
    };
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const dispatch = useDispatch();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            await savePhoto(result.assets[0].uri);
        }
    };
    const savePhoto = async (uri) => {
        try {
            const filename = uri.split('/').pop();
            const newPath = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.copyAsync({
                from: uri,
                to: newPath
            });
            setPhoto(newPath)
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la photo:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Créer l'objet avec les données mises à jour
            const updatedData = {
                ...profileData,
                firstName,
                lastName,
                email,
                photo,
                adresse,
                birthDate,
                gender,
                phoneNumber
            };
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const uiUpdate = await dispatch(UserUpdateProfil(token, updatedData));
                    loadProfil();
                    navigation.navigate('Profil')
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
    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowStart(Platform.OS === 'ios');
        setBirthDate(currentDate);
    };
    const isFormValid = firstName && lastName && email && adresse && birthDate && gender && phoneNumber;
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Update Profil</Text>
            <View style={styles.fieldset}>
                <Text style={styles.legend}>Profil Details </Text>
                <View style={styles.field}>
                    <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.photo} />
                        ) : (
                            <Text>Choose photo</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Adresse</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Adress"
                        value={adresse}
                        onChangeText={setAdress}
                        keyboardType="address"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="phoneNumber"
                        onChangeText={handleChange}
                        value={phoneNumber}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.containerDate}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.labelText}>birthDate : {Formedate(birthDate)}</Text>
                        {showStart && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(birthDate)}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeStartDate}
                            />
                        )}
                        <TouchableOpacity onPress={showStartDatepicker} style={styles.button}>
                            <MaterialIcons name="event-note" size={24} color="blue" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.field}>
                <Text style={styles.labelText}>Select Gender:</Text>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.radioContainer}
                        onPress={() => setGender(option.value)}
                    >
                        <View style={styles.radioButton}>
                            {gender === option.value && <View style={styles.radioButtonSelected} />}
                        </View>
                        <Text style={styles.radioText}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
                </View>
                <TouchableOpacity style={styles.submitButton} 
             onPress={handleSubmit}
             disabled={!isFormValid}
             >
                <Text style={styles.submitButtonText}>update profil</Text>
            </TouchableOpacity>
                
            </View>
        </ScrollView>
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
    containerDate: {
        flexDirection: 'row',
        marginBottom: 15,
        padding: 10,

    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    dateText: {
        fontSize: 10,
    },
});

export default ProfilUpdate
