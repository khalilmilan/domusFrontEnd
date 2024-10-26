import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_USER } from "../constants";
import { ADRESSE_IP } from "../../constants";
//inscription 
export const actionSignup = (user) => {
    console.log("hi from action");
    console.log(user)
    
    return async (dispatch) => {
        try {
            let response = await fetch('http://'+ADRESSE_IP+':9002/user/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(user)
            }
            )
            if (!response.ok) {
                const responseError = await response.json();
                const errorMsg = responseError.message;
                let customeMsg = "oups, un probleme d'inscription"
                
                if (errorMsg === 'EMAIL_EXISTS') {
                    customeMsg = 'cette adresse email existe déja'
                } else if (errorMsg === 'TOO_MANY_ATTEMPS_TRY_LATER') {
                    customeMsg = 'trop de tentatives veuillez ressayer plus tard'
                } else if (errorMsg === 'WEAK_PASSWORD : Password should be at least 6 characters') {
                    customeMsg = 'mot de passe faible'
                } else if (errorMsg == 'INVALID_EMAIL') {
                    customeMsg = 'email invalid'
                }
                return responseError;
                throw new Error(errorMsg);
            }
            const dataObj = await response.json();
           
            console.log("dataob")
             console.log(dataObj)
            return dataObj
        } catch (error) {
            console.log(error)
        }
    }
}


//connexion



export const actionLogin = (email, password) => {

    return async (dispatch) => {
        console.log("email: "+email)
        console.log("password: "+password)
        let response = await fetch('http://'+ADRESSE_IP+':9002/user/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }
        ) 
        if (!response.ok) {
            const responseError = await response.json();
            const errorMsg = responseError.message;
            throw new Error(errorMsg);
        }
        const dataObj = await response.json();
        const token = dataObj.response.accessToken; // Remplace par le token récupéré
        try {
            // Décoder le token JWT
            const decoded = decodeJWT(token);
            console.log("decoded: " + JSON.stringify(decoded))
            // Accéder au idUser (assume que le payload contient un champ `idUser`)
            const userId = decoded.userId;
            console.log('idUser récupéré à partir du token JWT :', userId);
            const userType= decoded.userType;
            saveToAsyncStorage(dataObj.response.accessToken, userId,userType);
            dispatch(actionAuthUser(userId,dataObj.response.accessToken));
        } catch (error) {
            console.error('Erreur lors du décodage du token JWT', error);
        }
    }
}

//enregister la data (token,userId,dateTokenExpiration)


const saveToAsyncStorage = async (token, userId,userType) => {
    let t = await AsyncStorage.setItem("userDetails", JSON.stringify({
        token: token,
        userId: userId,
        role:userType
       // dateTokenExpired: dateTokenExpired
    }));
    
}
// Auth action
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};
const actionAuthUser = (userId, token) => {
    return {
        type: AUTH_USER,
        userId: userId,
        token: token
    }
}