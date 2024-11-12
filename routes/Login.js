import {
     StyleSheet, Text, TextInput,
    TouchableOpacity, View,ActivityIndicator,
    Animated,
    Keyboard,
    Image
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { actionLogin } from '../redux/actions/actionAuth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Icon
} from '@rneui/themed';
import { THEME_COLOR } from '../constants';
const Login = ({ navigation }) => {
    const [error, setError] = useState();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setISLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];
    const dispatch = useDispatch();
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
    useEffect(() => {
        load();
    }, [])
    const load = async () => {
        const userDetailsStr = await AsyncStorage.getItem("userDetails");
            const userDetailsObj = JSON.parse(userDetailsStr);
            const expireDate = new Date(userDetailsObj.dateTokenExpired * 1000);
            if (expireDate <= new Date()) {
                return;
            } else {
                  navigation.navigate('Home')
            }
    }
    const handleSave = async () => {
        try {
            Keyboard.dismiss();
            if (!formData.email.trim()) {
                showAlertWithMessage('Please enter your login');
                return;
            }
            if (!formData.password.trim()) {
                showAlertWithMessage('Please enter your password');
                return;
            }
            const login = await dispatch(actionLogin(formData));
            if (login.trim()) {
                showAlertWithMessage(login);
            } else {
                showAlertWithMessage('Connected', 'success');
                     setTimeout(() => {
                       navigation.navigate('Home')
                    }, 1500);
            }

        } catch (error) {
            setError(error.message);
            showAlertWithMessage(error.message);
        }
    }
    return (
        <LinearGradient
            colors={[THEME_COLOR, "#8A84FF"]}
            style={styles.container}>

            <View style={styles.logo}>
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
                {
                    isLoading ?
                        <ActivityIndicator
                            size="large"
                            color="white"
                        />
                        :

                        <Image
                            source={require('../assets/forum_domus_png2x.png')}
                        />
                }
            </View>

            <View style={styles.inputContainer}>

                <Text style={styles.text}> Connexion</Text>
                <TextInput
                    placeholder='Your Email'
                    keyboardType='email-adresse'
                    style={styles.input}
                    onChangeText={text => setFormData({ ...formData, email: text })}
                    value={formData.email}
                />
                <TextInput
                    placeholder='Your password'
                    secureTextEntry
                    style={styles.input}
                    onChangeText={text => setFormData({ ...formData, password: text })}
                    value={formData.password}
                />
                <LinearGradient
                    colors={["#FF6584", '#FF8BA7']}
                    style={styles.filterGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableOpacity style={styles.touchable} onPress={handleSave}>
                        <View style={styles.btnContainer}>
                            <MaterialIcons name="login" size={24} color='white' />
                            <Text style={styles.btnText}>
                                Login
                            </Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Inscription")}
                    style={styles.touchableInscription}
                >
                    <Icon name="app-registration" type="material" color="#FF6584" />
                    <Text style={{ textAlign: 'center', marginTop: 9, color: '#FF6584', fontSize: 15 }}>
                        Inscription
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1A91DA",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        marginBottom: 10
    },
    inputContainer: {
        width: "100%",
        paddingHorizontal: 50
    },
    input: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 25,
        padding: 9,
        textAlign: 'center',
        fontSize: 19,
        marginVertical: 10
    },
    touchable: {
        marginVertical: 9,
        borderRadius: 16,

    },
    btnContainer: {
        backgroundColor: 'transparent',
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
        color: "white",
        fontWeight: 'bold',
    },
    text: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center'
    },
    touchableInscription: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',

        flexDirection: 'row',
        alignItems: 'center',
    },
    filterGradient: {
        alignSelf: 'center',
        width: '80%',
        borderRadius: 25,
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

})