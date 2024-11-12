import { ADRESSE_IP } from "../../constants";

export const addVote = (token,vote) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9011/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(vote)
            });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error)
  }
};
export const editVote = (token,vote) => async (dispatch) => {
  try { 
    const response = await fetch(`http://${ADRESSE_IP}:9011/vote/${vote.idVote}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(vote)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};