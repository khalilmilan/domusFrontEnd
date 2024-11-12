import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails, UserProfil } from '../redux/actions/actionUser';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import MySvgImage from '../assets/logo_couverture.svg';
const Portfolio = ({ navigation, route }) => {

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const handleEditPress = () => {
        navigation.navigate("profilUpdate", { profilData: userProfil.user, loadProfil:load });
    }
    const [userProfil, setUserProfil] = useState("");
     const load = async () => {
         try {
             let userDetails = await AsyncStorage.getItem("userDetails");
             if (userDetails != null) {
                 let user = JSON.parse(userDetails);
                 let tokens = user.token;
                 let idUser = user.userId;
                 setToken(tokens)
                 const result = await dispatch(UserDetails(tokens, idUser));
                 setUserProfil(result)
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
     }, [token])
    const formatBirthdate = (dateString) => {
        if (!dateString) return ''; // Gérer le cas où dateString est undefined ou null
        const date = parseISO(dateString);
        return format(date, 'dd-MM-yyyy');
    };
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    }
    else {
        return (
            <ScrollView style={styles.container}>
                 <View style={styles.coverPhotoContainer}>
                        <MySvgImage width="100%" height={200} />
                    </View>
                <View style={styles.headerContainer}>
                    <View style={styles.profileContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={
                                userProfil.user.photo
                                ? {uri: userProfil.user.photo}
                                : userProfil.user.gender === 'MALE'
                                ? require('../assets/avatar0.png')
                                : require('../assets/avatar2.png')
                            }
                        />
                        <Text style={styles.nameText}>{userProfil.user.firstName} {userProfil.user.lastName}</Text>
                    </View>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Email: </Text><Text style={styles.valueText}>{userProfil.user.email}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>birthDate: </Text><Text style={styles.valueText}>{formatBirthdate(userProfil.user.birthDate)}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>PhoneNumber: </Text><Text style={styles.valueText}>{userProfil.user.phoneNumber}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Adress: </Text> <Text style={styles.valueText}>{userProfil.user.adresse}</Text>
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>
                        <Text style={styles.nameText}>Gender: </Text> <Text style={styles.valueText}>{userProfil.user.gender}</Text>
                    </Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>{userProfil.countProject}</Text>
                        <Text style={styles.statLabel}>Projects</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>{userProfil.countEvent}</Text>
                        <Text style={styles.statLabel}>Events</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>{userProfil.countSurvey}</Text>
                        <Text style={styles.statLabel}>surveys</Text>
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
        height: "100%",
       // marginTop: -30,
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
    coverPhotoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: "#3d3b8f", // Couleur de fond de réserve pendant le chargement de l'image
  },
})