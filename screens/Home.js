import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const Home = ({ navigation }) => {
    const authUser = useSelector(state => state.users)
    console.log(authUser)
    const remove = async() => {
        try {
           // await AsyncStorage.removeItem("user");
        //    await AsyncStorage.clear();
            navigation.navigate("Login")
        } catch (error) {
            alert(error)
        }
    }

    return (
        <View style={styles.container}>
           
            <Pressable
                style={({pressed}) => ({ backgroundColor: pressed ? 'lightseagreen' : 'rebeccapurple' }) }
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