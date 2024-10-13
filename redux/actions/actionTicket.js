import { ADRESSE_IP } from "../../constants";
export const addTicket = (token,ticket) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9027/ticket`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(ticket)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};
export const fetchTicket = (token, idTicket) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9027/ticket/${idTicket}`, {
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
export const editTicket = (token,project) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9027/ticket/${project.idProject}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(project)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteTicketById = (token,idTicket) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9027/ticket/${idTicket}`, {
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

