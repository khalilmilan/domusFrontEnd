import { ADRESSE_IP } from "../../constants";
export const fetchSurveys = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9024/survey/by_user/${idUser}`, {
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
export const addSurvey = (token,survey) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9024/survey`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(survey)
            });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error)
  }
};

export const fetchSurvey = (token, idSurvey) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9024/survey/${idSurvey}`, {
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
export const editSurvey = (token,survey) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9024/survey/${survey.idSurvey}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(survey)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteSurveyById = (token,idSurvey) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9024/survey/${idSurvey}`, {
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
export const fetchParticpantSurveys = (token, idUser) => { 
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9024/survey/by_participant/${idUser}`, {
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