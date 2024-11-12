import { ADRESSE_IP } from "../../constants";

export const addDevice = (token,device) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9022/user_device`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(device)
            });
  
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
  }
};