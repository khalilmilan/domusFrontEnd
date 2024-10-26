import { ADRESSE_IP } from "../../constants";

export const addSurveyValue = (token,surveyValue) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9025/survey_value`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(surveyValue)
            });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error)
  }
};

export const fetchSurveyValue = (token, idSurvey) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9025/survey_value/${idSurvey}`, {
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
export const editSurveyValue = (token,surveyValue) => async (dispatch) => {
  try {
    console.log("idSurveyValue: "+surveyValue.idSurveyValue)
    console.log("surveyValue: "+JSON.stringify(surveyValue))
    const response = await fetch(`http://${ADRESSE_IP}:9025/survey_value/${surveyValue.idSurveyValue}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(surveyValue)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
};

export const deleteSurveyValueById = (token,idSurvey) => async (dispatch) => {
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