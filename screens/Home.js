import React, { useState,useEffect } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { addDevice } from '../redux/actions/actionDevice';
const Home = ({ navigation,route }) => {
const [role, setRole] = useState();
const [userId, setUserId] = useState(null);
const [token, setToken] = useState(null);
const dispatch = useDispatch();
    const load = async () => {
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
                let user = JSON.parse(userDetails);
                if(user!=undefined){
                setToken(user.token);
                let idUser = user.userId;
                setRole(user.role);
                setUserId(idUser);  // Met à jour l'état avec l'ID récupéré
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'ID', error);
            }
            finally {
                setLoading(false);
            }
       
    };
    const authUser = useSelector(state => state.users);
    const remove = async () => {
        try {
            navigation.navigate("Login")
        } catch (error) {
            alert(error)
        }
    }
    useEffect(() => {
    load();
    registerForPushNotifications()
  }, [userId]);

async function getDeviceId() {
  const deviceId = Device.osInternalId || Device.osBuildId || Device.modelId;
  return deviceId;
}
  async function registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      const tokenDevice = (await Notifications.getExpoPushTokenAsync()).data;
      // Remplacer par l’ID utilisateur réel
      const deviceId = await getDeviceId(); // ID unique pour l'appareil, généré sur le front
       const userDevice ={
        idUser:userId,
        uid:deviceId,
        token:tokenDevice,
        version: Platform.OS,
        status:1
    }
      let saveDevice= await dispatch(addDevice(token,userDevice))
    } else {
      alert("Permission pour les notifications non accordée !");
    }
  }
    return (
        <View style={styles.container}>

            <Pressable
                style={({ pressed }) => ({ backgroundColor: pressed ? 'lightseagreen' : 'rebeccapurple' })}
                onPress={remove}
            >
                <Text style={styles.btn}>effacer</Text>
            </Pressable>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightblue',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 24
    },
    btn: {
        padding: 12,
        color: "white"
    }
})