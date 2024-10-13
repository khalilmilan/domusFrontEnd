import { ADRESSE_IP } from "../../constants";


export const UserProfil = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9002/user/${idUser}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            dispatch({ type: 'SET_USER_PROFILE', payload: data });
            return data; // Assurez-vous de retourner les données

        } catch (error) {
            console.log(error)
        }
    }
}

export const UserUpdateProfil = (token, user) => {
   
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9002/user/${user.idUser}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(user)
            });
           // const data = await response.json();
            if (response.ok) {
                // Mettre à jour les données locales
                // await AsyncStorage.setItem('userDetails', JSON.stringify(updatedData));
                Alert.alert('Succès', 'Profil mis à jour avec succès');
            } else {
                throw new Error('Erreur lors de la mise à jour du profil');
            }
           // dispatch({ type: 'SET_USER_PROFILE', payload: data });
          //  return data; // Assurez-vous de retourner les données

        } catch (error) {
            console.log(error)
        }
    }
}