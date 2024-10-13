import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfil } from '../redux/actions/actionUser';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { ProfileContext } from '../redux/ProfileProvider';
const Portfolio = ({ navigation, route }) => {
    const { profileData, updateProfile } = useContext(ProfileContext);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const handleEditPress = () => {
        navigation.navigate("profilUpdate", { profilData: profileData });
    }
    /* const load = async () => {
         try {
             let userDetails = await AsyncStorage.getItem("userDetails");
             console.log("userDetails from AsyncStorage:", userDetails);
             if (userDetails != null) {
                 let user = JSON.parse(userDetails);
                 let token = user.token;
                 let idUser = user.userId;
                 const result = await dispatch(UserProfil(token, idUser));
                 setProfileData(result);
                 // Faites quelque chose avec profileData ici
             } else {
                 console.log("No user details found in AsyncStorage");
             }
         } catch (error) {
             console.error("Error in load function:", error);
         }finally{
              setLoading(false);
         }
     }
     useEffect(() => {
         load();
     }, [])*/
    useEffect(() => {
        // Fonction pour récupérer l'ID de l'utilisateur depuis AsyncStorage
        const getUserIdFromStorage = async () => {
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
                let user = JSON.parse(userDetails);
                setToken(user.token);
                let idUser = user.userId;
                if (idUser) {
                    setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID', error);
            }
        };
        getUserIdFromStorage();  // Appelle la fonction pour récupérer l'ID
    }, []);
    useEffect(() => {
        // Charger les données du profil une fois l'ID récupéré
        const fetchProfileData = async () => {
            try {
                if (userId) {
                    // Requête pour obtenir les données du profil avec l'ID récupéré

                    let test = await dispatch(UserProfil(token, userId)).then(result => {
                        updateProfile(result);
                        setLoading(false);
                    });
                    // Met à jour les données du profil
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données de profil', error);
            } finally {
                // setLoading(false);  // Arrête l'indicateur de chargement
            }
        };

        if (userId) {
            fetchProfileData();  // Charger les données seulement si l'ID est présent
        }
    }, [userId]);
    const [firstName, setFirstName] = useState(profileData ? profileData.firstName : "");
    const [lastName, setLastName] = useState(profileData ? profileData.lastName : '');
    const [email, setEmail] = useState(profileData ? profileData.email : '');
    const [photo, setPhoto] = useState(profileData ? profileData.photo : '');
    const [adresse, setAdress] = useState(profileData ? profileData.adresse : '');
    const [birthDate, setBirthDate] = useState(profileData ? profileData.birthDate : '');
    const [gender, setGender] = useState(profileData ? profileData.gender : '');
    const [phoneNumber, setPhoneNumber] = useState(profileData ? profileData.phoneNumber : '');

    const formatBirthdate = (dateString) => {
        if (!dateString) return ''; // Gérer le cas où dateString est undefined ou null
        const date = parseISO(dateString);
        return format(date, 'dd-MM-yyyy');
    };
    useEffect(() => {
        setLoading(false)
    }, [profileData])
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    }
    else {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image
                        style={styles.coverPhoto}
                        source={{ uri: 'https://www.bootdey.com/image/280x280/1E90FF/1E90FF' }}
                    />
                    <View style={styles.profileContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={photo ? { uri: photo } : require('../assets/avatar1.png')}
                        />
                        <Text style={styles.nameText}>{firstName} {lastName}</Text>
                    </View>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Email: </Text><Text style={styles.valueText}>{email}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>birthDate: </Text><Text style={styles.valueText}>{formatBirthdate(birthDate)}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>PhoneNumber: </Text><Text style={styles.valueText}>{phoneNumber}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Adress: </Text> <Text style={styles.valueText}>{adresse}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Gender: </Text> <Text style={styles.valueText}>{gender}</Text>
                    </Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>1234</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>5678</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>9101</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleEditPress}>
                    <Text style={styles.buttonText} >Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

export default Portfolio

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24
    },
    btnContainer: {
        flexDirection: 'row'
    },
    btnText: {
        color: '#fff',
        fontSize: 19,
        paddingBottom: 9
    },
    headerContainer: {
        alignItems: 'center',
    },
    coverPhoto: {
        width: '100%',
        height: 200,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -50,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
    },
    valueText: {
        fontSize: 15,
        marginTop: 10,
    },
    bioContainer: {
        padding: 15,
    },
    bioText: {
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
    },
    statContainer: {
        alignItems: 'center',
        flex: 1,
    },
    statCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 16,
        color: '#999',
    },
    button: {
        backgroundColor: '#0066cc',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
})