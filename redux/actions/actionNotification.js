import { ADRESSE_IP } from "../../constants";


export const fetchNotification = (token,deviceToken) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9007/notification/by_token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(deviceToken)
            });
    const notifications = await response.json();
    return notifications;
  } catch (error) {
    console.log(error)
  }
};