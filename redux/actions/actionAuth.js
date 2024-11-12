import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_USER } from "../constants";
import { ADRESSE_IP } from "../../constants";
import moment from 'moment';

import { decode as atob } from 'base-64';
//inscription 
export const actionSignup = (user) => {
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
            const dataObj = await response.json();
            return dataObj
        } catch (error) {
            console.log(error)
        }
    }
}


//connexion
export const actionLogin = (formData) => {
    return async (dispatch) => {  
        let response = await fetch('http://'+ADRESSE_IP+':9002/user/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        }
        ) 
        if (!response.ok) {
            const responseError = await response.json();
            const errorMsg = responseError.message;
            return errorMsg;
           // throw new Error(errorMsg);
        }
        const dataObj = await response.json();
        const token = dataObj.response.accessToken; 
        const accessTokenExpiresAt = dataObj.response.accessTokenExpiresAt;
        const refreshToken = dataObj.response.refreshToken;
        try {
            // Décoder le token JWT
            const decoded = decodeJWT(token);
            console.log("decoded1: "+decoded)
            console.log("decoded: " + JSON.stringify(decoded))
            // Accéder au idUser (assume que le payload contient un champ `idUser`)
            const userId = decoded.userId;
            const userType = decoded.userType;
            const phoneNumber = decoded.userPhoneNumber; 
            saveToAsyncStorage(
             dataObj.response.accessToken,
             userId,
             userType,
             accessTokenExpiresAt,
             refreshToken,
             phoneNumber);
            dispatch(actionAuthUser(userId,dataObj.response.accessToken));
           
        } catch (error) {
            console.error('Erreur lors du décodage du token JWT', error);
        }
         return '';
    }
}

//deconnexion 
export const actionLogout = (user) => {
    return async (dispatch) => {
        try {
            let response = await fetch('http://'+ADRESSE_IP+':9002/user/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(user)
            }
            )
            const dataObj = await response.json();
            return dataObj
        } catch (error) {
            console.log(error)
        }
    }
}
//enregister la data (token,userId,dateTokenExpiration)
const saveToAsyncStorage = async (token, userId,role,dateTokenExpired,refreshToken,phoneNumber) => {
    console.log('dateTokenExpired :'+dateTokenExpired)
    let t = await AsyncStorage.setItem("userDetails", JSON.stringify({
        token,
        userId,
        role,
        dateTokenExpired,
        refreshToken,
        phoneNumber
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