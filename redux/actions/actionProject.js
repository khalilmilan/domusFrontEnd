import { ADRESSE_IP } from "../../constants";
export const fetchProjects = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9026/project/by_user/${idUser}`, {
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
export const addProject = (token,project) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9026/project`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(project)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};

export const deleteProjectById = (token,idProject) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9026/project/${idProject}`, {
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
export const fetchProject = (token, idProject) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9026/project/${idProject}`, {
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
export const editProject = (token,project) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9026/project/${project.idProject}`, {
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
export const deleteUserFromProject = (token,idProject,idUser) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9026/project/delete_memebre/${idProject}/${idUser}`, {
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
export const addUserToProject = (token,idProject,idUser) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9026/project/add_membre/${idProject}/${idUser}`, {
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
export const getPossibleUser = (token,idProject) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9038/project-user/not_in/${idProject}`, {
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

export const fetchParticipantProjects = (token, idUser) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://${ADRESSE_IP}:9026/project/by_participant/${idUser}`, {
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

