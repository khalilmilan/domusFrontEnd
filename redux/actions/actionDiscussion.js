import { ADRESSE_IP } from "../../constants";

export const fetchDiscussions = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9023/discussion/discussion_by_user/${idUser}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    }
}

export const fetchDiscussion = (token, idDiscussion) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9023/discussion/${idDiscussion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    }
}

export const fetchPossibleUsers = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9023/discussion/possible_user/${idUser}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    }
}



export const addDiscussion = (token,newdiscussion) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9023/discussion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(newdiscussion)
            });
    console.log("response: "+response)
    console.log("responseStringfy: "+JSON.stringify(response.json))
    const data = await response.json();
    console.log("data: "+JSON.stringify(data))
    return data;
  } catch (error) {
    console.log(error)
  }
};