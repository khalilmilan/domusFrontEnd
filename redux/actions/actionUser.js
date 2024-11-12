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

export const UserUpdateProfils = (token, formData) => {
    console.log('formData: ' + JSON.stringify(formData))
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9002/user/${formData.idUser}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                //  body:JSON.stringify(formData)
            });
            // const data = await response.json();


            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du profil');
            }

            // dispatch({ type: 'SET_USER_PROFILE', payload: data });
            console.log("set: ")
            console.log("data: " + response)
            return data; // Assurez-vous de retourner les données

        } catch (error) {
            console.log(error)
        }
    }
}
export const UserUpdateProfil = (token, formData) => async (dispatch) => {
    try {
        const response = await fetch(`http://${ADRESSE_IP}:9002/user/${formData.idUser}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        // const data = await response.json();
       

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du profil');
        }
        return response; // Assurez-vous de retourner les données

    } catch (error) {
        console.log("error: "+error)
    }
};
export const UserDetails = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9002/user/get_user_details/${idUser}`, {
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