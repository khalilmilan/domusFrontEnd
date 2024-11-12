import { ADRESSE_IP } from "../../constants";

export const makeMessage = (token,message) => async (dispatch) => {
  try {
    console.log("message:"+JSON.stringify(message))
    const response = await fetch(`http://${ADRESSE_IP}:9009/message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(message)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};
export const editMessages = (token,idDiscussion,idSender) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9009/message/update_message_status/${idDiscussion}/${idSender}`, {
                method: 'PUT',
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