import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useState,useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
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
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserProfil } from '../redux/actions/actionUser';

const CustomDrawerContent = (props) => {

    const [isDark, setIsDark] = useState(false);
    const [token, setToken] = useState('');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [photo,setPhoto] = useState();
    const [user,setUser] = useState();
    const [gender,setGender] = useState();
    const toggleDarkTheme = () => {
        setIsDark(!isDark)
    }
    const dispatch = useDispatch();
    const load = async()=>{
       try {
        let userDetails = await AsyncStorage.getItem("userDetails");
        if (userDetails != null) {
            let user = JSON.parse(userDetails);
                 let tokens = user.token;
                 let idUser = user.userId;
                 const result = await dispatch(UserProfil(tokens, idUser));
                 setUser(result)
                 setToken(tokens)
                 setFirstName(result.firstName);
                 setLastName(result.lastName);
                 setEmail(result.email);
                 setRole(result.role);
                 setPhoto(result.photo)
                 setGender(result.gender);
        }
       } catch (error) {
        alert(error)
       }
    }
    useLayoutEffect(()=>{
        load();
    },[token])
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContentContainer}>
                    {user &&<View style={styles.userInfoContainer}>
                        <View style={styles.userInfoDetails}>
                            <Avatar.Image
                               // source={{uri: 'https://pbs.twimg.com/profile_images/1377945951978061827/E8hmHwUv_400x400.jpg'}}
                                 source={
                                photo
                                ? { uri: photo }
                                : gender === 'MALE'
                                ? require('../assets/avatar0.png')
                                : require('../assets/avatar2.png')
                            }
                                size={90}
                            />
                            <View style={styles.name}>
                                <Title style={styles.title}> {firstName} {lastName}</Title>
                                <Caption style={styles.caption}>{email}</Caption>
                            </View>
                        </View>

                        <View style={styles.followers}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.section]}>24</Paragraph>
                                <Caption style={styles.caption}>Abonnements</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.section]}>48</Paragraph>
                                <Caption style={styles.caption}>Abonnés</Caption>
                            </View>
                        </View>
                    </View>}

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            label="Profil"
                            icon={({color, size}) => <MaterialIcons name="face" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Profil') }
                        />

                        <DrawerItem 
                            label="Events"
                            icon={({color, size}) => <MaterialIcons name="list-alt" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Listes') }
                        />

                        <DrawerItem 
                            label="Groups"
                            icon={({color, size}) => <MaterialIcons name="group" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Sujets') }
                        />
                        <DrawerItem 
                            label="Projects"
                            icon={({color, size}) => <MaterialIcons name="assignment" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Signets') }
                        />
                        <DrawerItem 
                            label="Surveys"
                            icon={({color, size}) => <MaterialIcons name="poll" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Moments') }
                        />
                        <DrawerItem 
                            label="Discussions"
                            icon={({color, size}) => <MaterialIcons name="message" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Discussions') }
                        />
                    </Drawer.Section>

                    <Drawer.Section title="Réglages">
                        <DrawerItem 
                            label="Paramètres de confidentialité"
                            icon={({color, size}) => <MaterialIcons name="settings" size={size} color={color} />}
                            onPress={() => props.navigation.navigate('Settings') }
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
            </DrawerContentScrollView>

            <Drawer.Section style={styles.logOutSection}>
                <DrawerItem 
                    label="Déconnexion"
                    icon={({color, size}) => <MaterialIcons name="logout" size={size} color={color} />}
                    onPress={() => alert('Déconnecté') }
                />
            </Drawer.Section>
        </View>
    )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
    container: { flex: 1},
    drawerContentContainer: {flex: 1},
    userInfoContainer: { paddingLeft: 20},
    userInfoDetails: {marginTop: 15},
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
    }
})
