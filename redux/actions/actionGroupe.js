import { ADRESSE_IP } from "../../constants";

export const fetchGroups = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/by_user/${idUser}`, {
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
export const addGroup = (token,groupe) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9008/groupe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(groupe)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};

export const fetchGroup = (token, idGroupe) => {
    console.log("token: "+token)
    console.log('idGroupe: '+idGroupe)
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/${idGroupe}`, {
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
export const editGroupe = (token,groupe) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/${groupe.idGroupe}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(groupe)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteGroupeById = (token,idGroupe) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/${idGroupe}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};
export const addUserToGroupe = (token,idGroupe,idUser) => async (dispatch) => {
  try {
    console.log('token: '+token);
    console.log('idGroupe: '+idGroupe);
    console.log("idUser: "+idUser);
    const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/add_membre/${idGroupe}/${idUser}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteUserFromGroupe = (token,idGroupe,idUser) => async (dispatch) => {
  try {
    console.log('token: '+token);
    console.log('idGroupe: '+idGroupe);
    console.log("idUser: "+idUser);
    const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/delete_membre/${idGroupe}/${idUser}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};
export const getPossibleUser = (token,idGroupe) => async (dispatch) => {
  try {
    
    const response = await fetch(`http://${ADRESSE_IP}:9020/groupe_user/not_in/${idGroupe}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
   const users = await response.json();
    return users;
  } catch (error) {
    console.log(error)
  }
};
export const fetchMembreGroups = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9008/groupe/by_membre/${idUser}`, {
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