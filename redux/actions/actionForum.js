import { ADRESSE_IP } from "../../constants";

export const fetchForum = (token, idForum) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9005/forum/${idForum}`, {
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
export const addForum = (token,forum) => async (dispatch) => {
  try {
    console.log("token: "+token)
    console.log('forum: '+forum)
    const response = await fetch(`http://${ADRESSE_IP}:9005/forum`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(forum)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};

export const updateForumm = (token,updateForum) => async (dispatch) => {
  try {
    console.log("token: "+token)
    console.log('idEvent: '+updateForum.idForum)
    console.log('eventUpdate: '+JSON.stringify(updateForum))
    const response = await fetch(`http://${ADRESSE_IP}:9005/forum/${updateForum.idForum}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(updateForum)
            });
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteForumById = (token,idForum) => async (dispatch) => {
  try {
    console.log("token: "+token)
    console.log('idForums: '+idForum)
    const response = await fetch(`http://${ADRESSE_IP}:9005/forum/${idForum}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
  }
};
