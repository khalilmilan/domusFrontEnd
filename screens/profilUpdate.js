import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { UserUpdateProfil } from '../redux/actions/actionUser';
import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Animated,
    ScrollView,
    SafeAreaView,
    Image

} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Icon } from '@rneui/base';
import { Formedate } from '../.expo/utils/formatDate';
import { actionSignup } from '../redux/actions/actionAuth';
import { THEME_COLOR } from '../constants';
const ProfilUpdate = ({ navigation, route }) => {
    let profileData = route.params.profilData;
    let loadProfil = route.params.loadProfil;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        idUser:profileData.idUser,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
        birthDate: new Date(profileData.birthDate),
        gender: profileData.gender,
        adresse: profileData.adresse,
        photo: profileData.photo
    });
    const [errors, setErrors] = useState({});
    const options = [
        { id: '1', label: 'Male', value: 'MALE' },
        { id: '2', label: 'Female', value: 'FEMELLE' },
    ];
    const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];
    const scrollViewRef = useRef(null);

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
            setFormData({...formData,photo: newPath});
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la photo:', error);
        }
    };
    const showNotification = () => {
        slideAnim.setValue(-100);
        fadeAnim.setValue(0);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowAlert(false));
        }, 3000);
    };
    const showAlertWithMessage = (message, type = 'error') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        showNotification();
    };

    const handleBirthDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setFormData({ ...formData, birthDate: selectedDate });
            if (Platform.OS === 'android') {
                setShowBirthDatePicker(false);
            }
        }
    };
    const validate = () => {
        let newErrors = {};
        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = 'Invalide Email';
        }
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Enter your First Name';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Enter your Last Name';
        }
        if (new Date() <= new Date(formData.birthDate)) {
            newErrors.birthDate = 'Invalide Birthdate';
        }
        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }
        if (!formData.adresse) {
            newErrors.adresse = 'Adresse is required';
        }
        if (!formData.phoneNumber || formData.phoneNumber.length != 8) {
            newErrors.phoneNumber = 'Phone number must contain at least 8 numbers';
        }
        setErrors(newErrors);
       
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        if (validate()) {   
                try {
                    let userDetails = await AsyncStorage.getItem("userDetails");
                    if (userDetails != null) {
                        let user = JSON.parse(userDetails);
                        let token = user.token;
                        
                        const uiUpdate = await dispatch(UserUpdateProfil(user.token, formData));
                       console.log('ui: '+JSON.stringify(uiUpdate))
                       console.log('ui: '+uiUpdate)
                        if (uiUpdate.status == 200) {
                            showAlertWithMessage('Compte Edited successfully!', 'success');
                            loadProfil();
                            setTimeout(() => {
                             navigation.navigate('Profil')
                            }, 1500);
                        }
                     
                    } else {
                        console.log("No user details found in AsyncStorage");
                    }
                } catch (error) {
                    console.error("Error in load function:", error);
                }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView ref={scrollViewRef}>
                {showAlert && (
                    <Animated.View
                        style={[
                            styles.alert,
                            alertType === 'success' ? styles.alertSuccess : styles.alertError,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.alertContent}>
                            <Ionicons
                                name={alertType === 'success' ? 'checkmark-circle' : 'alert-circle'}
                                size={24}
                                color={alertType === 'success' ? '#fff' : '#fff'}
                            />
                            <Text style={styles.alertText}>{alertMessage}</Text>
                        </View>
                    </Animated.View>
                )}

                <Text style={styles.formTitle}>Edit Profil</Text>

                <View style={styles.fieldsetWrapper}>
                    <View style={styles.fieldset}>
                        <View style={styles.legendWrapper}>
                            <View style={styles.legendLine} />
                            <View style={styles.legendContainer}>
                                <Ionicons
                                    name={'information-circle-outline'}
                                    size={18}
                                    color="#8A84FF"
                                />
                                <Text style={styles.legend}>Compte informations</Text>
                            </View>
                            <View style={styles.legendLine} />
                        </View>
                        <View style={styles.fieldsetContent}>
                            <View style={styles.inputContainer}>
                                <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                                    {formData.photo ? (
                                        <Image source={{ uri: formData.photo }} style={styles.photo} />
                                    ) : (
                                        <Text>Choose photo</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>First Name</Text>
                                <View style={[styles.inputWrapper, errors.firstName && styles.inputError]}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#999"
                                        placeholder="Enter your first name..."
                                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                                        value={formData.firstName}
                                    />

                                </View>
                                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Last Name</Text>
                                <View style={[styles.inputWrapper, errors.lastName && styles.inputError]}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#999"
                                        placeholder="Enter your last name..."
                                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                                        value={formData.lastName}
                                    />
                                </View>
                                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#999"
                                        placeholder="Enter your Email..."
                                        onChangeText={(email) => setFormData({ ...formData, email: email })}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={formData.email}
                                    />
                                </View>
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}> Birthdate </Text>
                                <TouchableOpacity
                                    style={[styles.inputWrapper, errors.birthDate && styles.inputError]}
                                    onPress={() => setShowBirthDatePicker(!showBirthDatePicker)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#666" style={styles.dateIcon} />
                                    <Text style={styles.dateButtonText}>
                                        {Formedate(formData.birthDate)}
                                    </Text>
                                </TouchableOpacity>
                                {showBirthDatePicker && (
                                    <DateTimePicker
                                        value={formData.birthDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleBirthDateChange}
                                        onRequestClose={() => setPickerVisible(false)}
                                    />
                                )}
                                {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
                            </View>
                            <View

                                style={[styles.inputContainerWrapper, errors.gender && styles.inputError]}
                            >
                                <Text style={styles.label}>Select gender</Text>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.radioContainer}
                                        onPress={() =>
                                            setFormData({ ...formData, gender: option.value })
                                        }
                                    >
                                        <View style={styles.radioButton}>
                                            {formData.gender === option.value && <View style={styles.radioButtonSelected} />}
                                        </View>
                                        <Text style={styles.radioText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Address</Text>
                                <View style={[styles.inputWrapper, errors.adresse && styles.inputError]}>
                                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#999"
                                        placeholder="Enter your address..."
                                        onChangeText={(text) => setFormData({ ...formData, adresse: text })}
                                        value={formData.adresse}
                                    />
                                </View>
                                {errors.adresse && <Text style={styles.errorText}>{errors.adresse}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Phone number</Text>
                                <View style={[styles.inputWrapper, errors.phoneNumber && styles.inputError]}>
                                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#999"
                                        placeholder="Enter your phone number..."
                                        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                        keyboardType="numeric"
                                        value={formData.phoneNumber}
                                    />
                                </View>
                                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Icon name="edit" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    fieldset: {
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    legendContainer: {
        position: 'absolute',
        top: -12,
        left: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        zIndex: 1,
    },
    legend: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
    },
    fieldsetContent: {
        padding: 20,
        paddingTop: 25,
    },
    alert: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        borderRadius: 12,
        zIndex: 100,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    alertSuccess: {
        backgroundColor: '#00b894',
    },
    alertError: {
        backgroundColor: '#ff7675',
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },

    dateButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: {
        marginRight: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fieldsetWrapper: {
        marginBottom: 25,
        paddingHorizontal: 15,
    },
    fieldset: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    legendWrapper: {
        position: 'absolute',
        top: -14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    legendLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#e0e0e0',
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    legend: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 6,
    },
    fieldsetContent: {
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputContainerWrapper: {
        marginBottom: 15,
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8A84FF',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },

    dateButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: {
        marginRight: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    submitButton: {
        backgroundColor: '#8A84FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -17,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8A84FF',
        marginBottom: 30,
        textAlign: 'center',
    },





    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 5,
        marginLeft: 15
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8A84FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#8A84FF',
    },
    radioText: {
        fontSize: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 50,
    },
    inputError: {
        borderColor: '#ff4444',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    touchable: {
        marginVertical: 1,
        borderRadius: 16,
        alignSelf: "flex-end"

    },
    btnContainer: {
        borderRadius: 25,
        padding: 6,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',

    },
    btnText: {
        fontSize: 20,
        textAlign: 'center',
        marginLeft: 5,
        color: THEME_COLOR,
        fontWeight: 'bold',
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
     alert: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        borderRadius: 12,
        zIndex: 100,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    alertSuccess: {
        backgroundColor: '#00b894',
    },
    alertError: {
        backgroundColor: '#ff7675',
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertText: {
        color: 'white',
        fontSize: 16,
    },
});


export default ProfilUpdate
