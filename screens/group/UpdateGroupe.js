
import React,{useState,useEffect} from 'react'
import { editGroupe, fetchGroup } from '../../redux/actions/actionGroupe';
import { StyleSheet, View, TextInput, Button } from 'react-native'

import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UpdateGroupe = ({navigation,route}) => {
   const [label, setLabel] = useState('');
    const dispatch = useDispatch();
    const [groupe,setGroupe]=useState();
    let idGroupe = route.params.idGroupe
    const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      console.log("userDetails from AsyncStorage:", userDetails);
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let token = user.token;
        const result = await dispatch(fetchGroup(token, idGroupe));
        setLabel(result.label)
        setGroupe(result)
        // Faites quelque chose avec profileData ici
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [])
    const handleSubmit = async() => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    let idUser = user.userId
                    const updatedGroupe = {
                        ...groupe,
                        label
                    };
                    const uiUpdate = await dispatch(editGroupe(token, updatedGroupe));
                    navigation.navigate('Sujets')
                    // Faites quelque chose avec profileData ici
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
            <TextInput
                style={styles.input}
                placeholder="label"
                value={label}
                onChangeText={setLabel}
            />
            <Button title="Update Groupe" onPress={handleSubmit} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
export default UpdateGroupe

