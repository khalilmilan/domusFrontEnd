import React, { useState, useContext } from 'react';
import { View, Text, TextInput,Button, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from 'react-redux';
import { UserUpdateProfil } from '../redux/actions/actionUser';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format,parseISO, isValid } from 'date-fns';
import { ProfileContext } from '../redux/ProfileProvider';
const ProfilUpdate = ({ navigation, route }) => {
    const { profileData, updateProfile } = useContext(ProfileContext);
    const [firstName, setFirstName] = useState(profileData.firstName || '');
    const [lastName, setLastName] = useState(profileData.lastName || '');
    const [email, setEmail] = useState(profileData.email || '');
    const [photo, setPhoto] = useState(profileData.photo || '');
    const [adresse, setAdress] = useState(profileData.adresse || '');
    const [birthDate, setBirthDate] = useState(profileData.birthDate || '');
    const [show, setShow] = useState(false);
    const [gender, setGender] = useState(profileData.gender);
    const [phoneNumber, setPhoneNumber] = useState(profileData.phoneNumber);
    
   const options = [
    { id: '1', label: 'Male', value: 'MALE' },
    { id: '2', label: 'Female', value: 'FEMELLE' },
  ];
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShow(Platform.OS === 'ios');
        setBirthDate(currentDate);
    };
    const handleChange = (text) => {
    // Optionnel : Formatage du numéro de téléphone
    const formattedText = text.replace(/[^0-9]/g, ''); // Supprime tous les caractères non numériques
    setPhoneNumber(formattedText);
  };
    const formatBirthdate = (date) => {
        if (!date) return ''; // Gérer le cas où date est undefined ou null
        let parsedDate;
        if (typeof date === 'string') {
             
            // Parser la date au format "1991-08-04 02:25:00.000000"
             const parsedDate1 = parseISO(date);
             return  format(parsedDate1, 'dd-MM-yyyy');
            
        } else if (date instanceof Date) {
             
            // Si c'est déjà un objet Date, on l'utilise directement
            parsedDate = date;
        } else {
            
            // Si ce n'est ni une chaîne ni un objet Date, on retourne une chaîne vide
            return '';
        }

        // Vérifier si la date est valide
        if (!isValid(parsedDate)) {
              c
            return '';
        }

        // Formater la date
        return format(parsedDate, 'dd-MM-yyyy');
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
            // Ici, vous pouvez faire ce que vous voulez avec le nouveau chemin,
            // comme le sauvegarder dans l'état de votre composant ou l'envoyer à un serveur
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
                    updateProfile(updatedData)
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

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                {photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                ) : (
                    <Text>Choisir une photo</Text>
                )}
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="firstName"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="lastName"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Adress"
                value={adresse}
                onChangeText={setAdress}
                keyboardType="address"
            />
            <TextInput
                style={styles.input}
                placeholder="phoneNumber"
                onChangeText={handleChange}
                value={phoneNumber}
                keyboardType="numeric"
            />
            <View style={styles.containerDate}>
                <View style={styles.dateContainer}>
                    <Text>birthDate : {formatBirthdate(birthDate)}</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.button}>
                        <Text style={styles.buttonText}>Choisir une date</Text>
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(birthDate)}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <Text style={styles.title}>Select Gender:</Text>
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
         <Button title="update profil" onPress={handleSubmit} />
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

export default ProfilUpdate
