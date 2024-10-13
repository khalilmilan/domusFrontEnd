import { ADRESSE_IP } from "../../constants";

export const FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';
export const fetchEvent = (token, idEvent) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9001/event/${idEvent}`, {
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
export const fetchEvents = (token,userId) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_EVENTS_START' });
    const response = await fetch(`http://${ADRESSE_IP}:9001/event/byUser/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
    const events = await response.json();
    dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: events });
  } catch (error) {
    dispatch({ type: 'FETCH_EVENTS_FAILURE', payload: error.message });
  }
};
export const addEvent = (token,eventUpdate) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9001/event`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(eventUpdate)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};

export const deleteEvent = (token,idEvent) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9001/event/${idEvent}`, {
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
export const updateEvent = (token,eventUpdate) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9001/event/${eventUpdate.idEvent}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(eventUpdate)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};
export const getPossibleUser = (token,idEvent) => async (dispatch) => {
  try {
    console.log("haw hné "+idEvent);
    const response = await fetch(`http://${ADRESSE_IP}:9003/event_user/not_in/${idEvent}`, {
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
export const addUserToEvent = (token,idEvent,idUser) => async (dispatch) => {
  try {
    console.log('token: '+token);
    console.log('idEvent: '+idEvent);
    console.log("idUser: "+idUser);
    const response = await fetch(`http://${ADRESSE_IP}:9001/event/add_participant/${idEvent}/${idUser}`, {
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

export const deleteUserFromEvent = (token,idEvent,idUser) => async (dispatch) => {
  try {
    console.log('token: '+token);
    console.log('idEvent: '+idEvent);
    console.log("idUser: "+idUser);
    const response = await fetch(`http://${ADRESSE_IP}:9001/event/${idEvent}/${idUser}`, {
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
