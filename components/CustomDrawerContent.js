import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useState, useLayoutEffect, useEffect } from 'react'
import { StyleSheet, View, Animated, Modal } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import {
    Text,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import { UserProfil } from '../redux/actions/actionUser';
import { actionLogout } from '../redux/actions/actionAuth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Icon
} from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
const CustomDrawerContent = (props) => {

    const [isDark, setIsDark] = useState(false);
    const [token, setToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('')
    const [user, setUser] = useState();
    const [role, setRole] = useState('');
    const [userProfil, setUserProfil] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];
    const toggleDarkTheme = () => {
        setIsDark(!isDark)
    }
    const dispatch = useDispatch();
    const load = async () => {
        try {

            let userDetails = await AsyncStorage.getItem("userDetails");
            const userDetailsObj = JSON.parse(userDetails);
            const expireDate = new Date(userDetailsObj.dateTokenExpired * 1000);
            if (expireDate > new Date()) {
                setRole(userDetailsObj.role)
                let user = JSON.parse(userDetails);
                setRefreshToken(user.refreshToken)
                const result = await dispatch(UserProfil(user.token, user.userId));
                setUser(result)
                setToken(user.token)
                setUserProfil(result)
            } else {
                props.navigation.navigate('Login')
            }
        } catch (error) {
            alert(error)
        }
    }
    useEffect(() => {
        load();
    }, [token])
    const logout = async () => {
        try {
            const logoutObj = {
                token,
                refreshToken
            }
            let logoutAction = await dispatch(actionLogout(logoutObj));
            setModalVisible(false)
            showAlertWithMessage('Bye bye '+userProfil.firstName, 'success');
            setTimeout(() => {
                props.navigation.navigate('Login')
            }, 1500);
        } catch (error) {
            console.log('error log out: ' + error)
        }
    }
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
    return (
        <View style={styles.container}>
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
            {userProfil != undefined && <DrawerContentScrollView {...props}>
                <View style={styles.drawerContentContainer}>
                    {user && <View style={styles.userInfoContainer}>
                        <View style={styles.userInfoDetails}>
                            <Avatar.Image
                                // source={{uri: 'https://pbs.twimg.com/profile_images/1377945951978061827/E8hmHwUv_400x400.jpg'}}
                                source={
                                    userProfil.photo
                                        ? { uri: userProfil.photo }
                                        : userProfil.gender === 'MALE'
                                            ? require('../assets/avatar0.png')
                                            : require('../assets/avatar2.png')
                                }
                                size={90}
                            />
                            <View style={styles.name}>
                                <Title style={styles.title}> {userProfil.firstName} {userProfil.lastName}</Title>
                                <Caption style={styles.caption}>{userProfil.email}</Caption>
                            </View>
                        </View>

                        <View style={styles.followers}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.section]}><Ionicons name="call" size={20} color="#666" style={styles.inputIcon} /></Paragraph>
                                <Caption style={styles.caption}>{userProfil.phoneNumber}</Caption>
                            </View>
                            {role=='ADMIN'
                            ?
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.section]}><Ionicons name="shield-checkmark" size={20} color="#666" style={styles.inputIcon} /></Paragraph>
                                <Caption style={styles.caption}>{role}</Caption>
                                
                            </View>
                            :
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.section]}><Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} /></Paragraph>
                                <Caption style={styles.caption}>{role}</Caption>
                                
                            </View>
                            }
                            
                        </View>
                    </View>}

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            label="Profil"
                            icon={({ color, size }) => <MaterialIcons name="face" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Profil')}
                        />
                        <DrawerItem
                            label="Notifications"
                            icon={({ color, size }) => <MaterialIcons name="notifications-active" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Settings')}
                        />

                        <DrawerItem
                            label="Events"
                            icon={({ color, size }) => <MaterialIcons name="list-alt" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Listes')}
                        />

                        <DrawerItem
                            label="Groups"
                            icon={({ color, size }) => <MaterialIcons name="group" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Sujets')}
                        />
                        <DrawerItem
                            label="Projects"
                            icon={({ color, size }) => <MaterialIcons name="assignment" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Signets')}
                        />
                        <DrawerItem
                            label="Surveys"
                            icon={({ color, size }) => <MaterialIcons name="poll" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Moments')}
                        />
                        <DrawerItem
                            label="Discussions"
                            icon={({ color, size }) => <MaterialIcons name="message" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Discussions')}
                        />
                    </Drawer.Section>

                    <Drawer.Section title="Réglages">
                        <DrawerItem
                            label="Paramètres de confidentialité"
                            icon={({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Settings')}
                        />
                        <TouchableRipple
                            onPress={() => toggleDarkTheme()}
                        >
                            <View style={styles.settings}>
                                <Text>Mode sombre</Text>
                                <View pointerEvents="none">
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
                                        onValueChange={toggleDarkTheme}
                                        value={isDark}
                                    />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>}

            <Drawer.Section style={styles.logOutSection}>
                <DrawerItem
                    label="Logout"
                    icon={({ color, size }) => <MaterialIcons name="logout" size={size} color={color} />}
                    onPress={() => setModalVisible(true)}
                />
            </Drawer.Section>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Icon
                            name="logout"
                            type="material"
                            color="#e74c3c"
                            size={50}
                        />
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalText}>
                            Do you really want to logout?
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonTextModal}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton}
                                onPress={logout}
                            >
                                <Text style={styles.buttonTextModal}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
    container: { flex: 1 },
    drawerContentContainer: { flex: 1 },
    userInfoContainer: { paddingLeft: 20 },
    userInfoDetails: { marginTop: 15 },
    name: {
        marginTop: 15,
        justifyContent: 'center'
    },
    title: {
        fontSize: 19,
        marginTop: 5,
        fontWeight: 'bold'
    },
    caption: { fontSize: 15 },
    followers: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 9
    },
    paragraph: {
        fontWeight: 'bold'
    },
    drawerSection: {
        marginTop: 19,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc'
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    logOutSection: {
        marginBottom: 19,
        borderTopWidth: 0.5,
        borderTopColor: "#ccc"
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#bdc3c7',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonTextModal: {
        color: '#fff',
        fontWeight: 'bold',
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
