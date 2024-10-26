import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails, UserProfil } from '../redux/actions/actionUser';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
const Portfolio = ({ navigation, route }) => {

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [profilData,setProfilData]=useState()
    const dispatch = useDispatch();
    const handleEditPress = () => {
        navigation.navigate("profilUpdate", { profilData: profilData, loadProfil:load });
    }
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [adresse, setAdress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [projectCount,setProjectCount] = useState();
    const [surveyCount,setSurveyCount] = useState();
    const [eventCount,setEventCount] = useState();
     const load = async () => {
         try {
             let userDetails = await AsyncStorage.getItem("userDetails");
             if (userDetails != null) {
                 let user = JSON.parse(userDetails);
                 let tokens = user.token;
                 let idUser = user.userId;
                 setToken(tokens)
                 const result = await dispatch(UserDetails(tokens, idUser));
                 setProfilData(result.user)
                 setFirstName(result.user.firstName);
                 setLastName(result.user.lastName);
                 setEmail(result.user.email)
                 setBirthDate(result.user.birthDate)
                 setPhoto(result.user.photo)
                 setGender(result.user.gender)
                 setAdress(result.user.adresse)
                 setPhoneNumber(result.user.phoneNumber)
                 setProjectCount(result.countProject);
                 setSurveyCount(result.countSurvey);
                 setEventCount(result.countEvent);
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
                <View style={styles.headerContainer}>
                    <Image
                        style={styles.coverPhoto}
                        source={require('../assets/forum-domus-logo_couverture.png')}
                    />
                    <View style={styles.profileContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={
                                photo
                                ? { uri: photo }
                                : gender === 'MALE'
                                ? require('../assets/avatar0.png')
                                : require('../assets/avatar2.png')
                            }
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
                        <Text style={styles.statCount}>{projectCount}</Text>
                        <Text style={styles.statLabel}>Projects</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>{eventCount}</Text>
                        <Text style={styles.statLabel}>Events</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statCount}>{surveyCount}</Text>
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
        height: 200,
        marginTop: -30,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -30,
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