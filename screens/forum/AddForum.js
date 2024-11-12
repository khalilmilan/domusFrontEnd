import { addForum } from '../../redux/actions/actionForum';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddForum = ({navigation, route}) => {
    const dispatch = useDispatch();
    let idEvent=route.params.eventId;
    let loadListForum = route.params.loadListForum
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];

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
    const handleSubmit = async() => {
        try {
           Keyboard.dismiss();
            if (!formData.title.trim()) {
                showAlertWithMessage('Please enter a title for the forum');
                return;
            }
            if (!formData.description.trim()) {
                showAlertWithMessage('Please add a description');
                return;
            }
            showAlertWithMessage('Forum added successfully!', 'success');
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    let idUser = user.userId
                    console.log("userId: "+user.userId)
                    const forum = {
                        ...formData,
                        idUser,
                        idEvent
                    };
                    const uiUpdate = await dispatch(addForum(token, forum));
                    loadListForum()
                    setTimeout(() => {
                        navigation.navigate('ListForum', { eventId: idEvent })
                    }, 1500);
                    
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
            {/* Alerte améliorée */}
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

            <Text style={styles.formTitle}>New Forum</Text>

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
                            <Text style={styles.legend}>Generales informations</Text>
                        </View>
                        <View style={styles.legendLine} />
                    </View>
                    <View style={styles.fieldsetContent}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Forum title</Text>
                            <TextInput
                                key="input-label"
                                style={styles.input}
                                value={formData.title}
                                onChangeText={(text) => setFormData({ ...formData, title: text })}
                                placeholder="Enter the title..."
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Forum description</Text>
                            <TextInput
                                key="input-description"
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Describe your Forum..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Add Forum</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
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
    textArea: {
        height: 120,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#8A84FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
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
   
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8A84FF',
        marginBottom: 30,
        textAlign: 'center',
        marginTop: 10,
    },
});
export default AddForum

