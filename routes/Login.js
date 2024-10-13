import {
    Pressable, StyleSheet, Text, TextInput,
    TouchableOpacity, View, Alert,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Platform } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { actionLogin, actionSignup } from '../redux/actions/actionAuth';
import DateTimePicker from '@react-native-community/datetimepicker';
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSingUp] = useState(true);
    const [error, setError] = useState();
    const [isLoading, setISLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [adresse, setAdress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState("ADMIN")
    const handleChange = (text) => {
        // Optionnel : Formatage du numéro de téléphone
        const formattedText = text.replace(/[^0-9]/g, ''); // Supprime tous les caractères non numériques
        setPhoneNumber(formattedText);
    };
    const options = [
        { id: '1', label: 'Male', value: 'MALE' },
        { id: '2', label: 'Female', value: 'FEMELLE' },
    ];
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShow(Platform.OS === 'ios');
        setBirthDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        if (error != null) {
            Alert.alert("erreur", error, [{ text: 'ok' }])
        }

    }, [error])

    useLayoutEffect(() => {
        load();
    }, [])
    const load = async () => {
        const userDetailsStr = await AsyncStorage.getItem("userDetails");
        if (userDetailsStr !== null) {
            alert(userDetailsStr)
            const userDetailsObj = JSON.parse(userDetailsStr);
            const { token, userId, dateTokenExpire } = userDetailsObj
            const expireDate = new Date(dateTokenExpire);
            if (expireDate <= new Date() || !token || !userId) {
                return;
            } else {
                navigation.navigate('Home')
            }
        }
    }
    const handleSave = async () => {
        console.log("hereser")
        if (email.length > 0 && password.length > 0) {
            console.log("email")
            if (isSignup) {
                console.log("isSignup")
                setError(null);
                setISLoading(true);
                try {
                    let user = {
                        firstName,
                        lastName,
                        phoneNumber,
                        email,
                        password,
                        birthDate,
                        gender,
                        adresse,
                        role
                    }
                    console.log("logewi");
                    console.log(user)
                    const retour = await dispatch(actionSignup(user));

                    if (retour.httpStatus == "OK") {
                        setIsSingUp(false)
                        setISLoading(false)
                    } else if (retour.httpStatus == "BAD_REQUEST") {
                        let errorMessage = ""
                        retour.subErrors.map((error) => {
                            errorMessage += error.field + ": " + error.message + "\n"
                        })
                        alert(errorMessage)
                    } else if (retour.httpStatus == "CONFLICT") {
                        alert(retour.message)
                    }
                } catch (error) {
                    setError(error.message);
                    setISLoading(false)
                }

            } else {
                console.log('here is login')
                setError(null);
                setISLoading(true);
                try {
                    const login = await dispatch(actionLogin(email, password));
                    navigation.navigate("Home");
                } catch (error) {
                    setError(error.message);
                    setISLoading(false)
                }
            }
        } else {
            alert("veuillez remplir tous les champs")
        }
    }
    return (
        <LinearGradient
            colors={['#1A91DA', "#FFF"]}
            style={styles.container}>
            <View style={styles.logo}>
                {
                    isLoading ?
                        <ActivityIndicator
                            size="large"
                            color="white"
                        />
                        :
                        <AntDesign name="twitter" size={80} color="white" />
                }

            </View>
            <View style={styles.inputContainer}>
                {!isSignup ?
                    (<>
                        <Text style={styles.text}>{isSignup ? "Inscription" : "Connexion"}</Text>
                        <TextInput
                            placeholder='Votre Email'
                            keyboardType='email-adresse'
                            style={styles.input}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            placeholder='Votre mot de passe'
                            secureTextEntry
                            style={styles.input}
                            onChangeText={text => setPassword(text)}
                        /></>)
                    : (<>
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
                            placeholder="Adress"
                            value={adresse}
                            onChangeText={setAdress}
                            keyboardType="address"
                        />
                        <TextInput
                            placeholder='Votre Email'
                            keyboardType='email-adresse'
                            style={styles.input}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            placeholder='Votre mot de passe'
                            secureTextEntry
                            style={styles.input}
                            onChangeText={text => setPassword(text)} />
                        <TextInput
                            style={styles.input}
                            placeholder="phoneNumber"
                            onChangeText={handleChange}
                            value={phoneNumber}
                            keyboardType="numeric"
                        />
                        <View style={styles.containerDate}>
                            <View style={styles.dateContainer}>
                                <Text>birthDate : </Text>
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
                    </>)}
                <TouchableOpacity style={styles.touchable} onPress={handleSave}>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>
                            Valider
                        </Text>
                    </View>
                </TouchableOpacity>

                <Pressable
                    onPress={() => setIsSingUp(prevState => !prevState)}
                >
                    <Text style={{ textAlign: 'center', marginTop: 9 }}>
                        {isSignup ? "vers connexion" : "vers inscription"}
                    </Text>
                </Pressable>
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
        marginBottom: 50
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
        marginVertical: 9
    },
    btnContainer: {
        backgroundColor: 'turquoise',
        borderRadius: 7,
        padding: 9

    },
    btnText: {
        fontSize: 17,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    text: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center'
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
    buttonText: {
        color: 'white',
        fontSize: 16,
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

})