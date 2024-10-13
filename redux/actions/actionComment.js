import { ADRESSE_IP } from "../../constants";

export const addComment = (token,comment) => async (dispatch) => {
  try {
    const response = await fetch(`http://${ADRESSE_IP}:9006/commentaire`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(comment)
            });
    const event = await response.json();
    return event;
  } catch (error) {
    console.log(error)
  }
};
export const updateComment = (token,comment) => async (dispatch) =>{
  try {
    console.log("comment"+JSON.stringify(comment))
  const response = await fetch(`http://${ADRESSE_IP}:9006/commentaire/${comment.idCommentaire}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body:JSON.stringify(comment)
            });
    return response;
  } catch (error) {
    console.log(error)
  }
}
export const deleteComment = (token,idComment) => async (dispatch) => {
  try {
    console.log("idComment: "+idComment)
    const response = await fetch(`http://${ADRESSE_IP}:9006/commentaire/${idComment}`, {
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