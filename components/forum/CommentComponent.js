import {
    Image, Button,
    StyleSheet, Text, View, TouchableOpacity, Modal
} from 'react-native'
import { fr } from 'date-fns/locale';
import { TextInput } from 'react-native-paper';
import React, { useState } from 'react'
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { deleteComment, updateComment } from '../../redux/actions/actionComment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteModalComponent from '../DeleteModalComponent';
import ToggleTextInput from './ToggleTextInput';

const CommentComponent = ({ item, idUser, loadComments }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(item.content);
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const handelDeleteComment = async () => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const uiDeleteComment = await dispatch(deleteComment(token, item.idCommentaire));
                    loadComments()
                } else {
                    console.log("No user details found in AsyncStorage");
                }
            } catch (error) {
                console.error("Error in load function:", error);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
        }
        setModalVisible(false);
    }
    const editComment = async () => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const comment = {
                        ...item,
                        content
                    };
                    const uiComment = await dispatch(updateComment(token, comment));
                    loadComments()
                    // navigation.navigate('EventDetails', { eventId: idEvent })
                    // Faites quelque chose avec profileData ici
                } else {
                    console.log("No user details found in AsyncStorage");
                }
            } catch (error) {
                console.error("Error in load function:", error);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
        }
        setIsEditing(!isEditing)

    }
    const handleShowModal = () => {
        setModalVisible(true); // Affiche le modal
    };

    const handleHideModal = () => {
        setModalVisible(false); // Cache le modal
    };
    return (

        <View style={styles.commentContainer}>
            <LinearGradient
                colors={['#f7f7f7', '#ffffff']}
                style={styles.commentGradient}
            >
                <View style={styles.commentHeader}>
                    <Image
                        source={
                            item.user.photo
                                ? { uri: item.user.photo }
                                : item.user.gender === 'MALE'
                                    ? require('../../assets/avatar0.png')
                                    : require('../../assets/avatar2.png')
                        }
                        style={styles.commentAuthorPhoto} />
                    <View style={styles.commentAuthorInfo}>
                        <Text style={styles.commentAuthorName}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
                        <Text style={styles.commentDate}>
                            {format(new Date(item.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </Text>
                    </View>
                </View>
                {idUser == item.user.idUser && isEditing
                    ?
                    (<View style={styles.updateView}>
                        <TextInput
                            placeholder="write comment"
                            value={content}
                            style={styles.commentInput}
                            onChangeText={setContent}
                        />
                        <TouchableOpacity style={styles.buttonUpdate} onPress={editComment}>
                            <Text style={styles.buttonTextUpdate}>edit</Text>
                        </TouchableOpacity>
                    </View>)
                    :
                    (
                        <Text style={styles.commentContent}>{item.content}</Text>

                    )
                }
                {idUser == item.user.idUser && <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(!isEditing)} >
                        <MaterialIcons name="edit" size={18} color="#4a90e2" />
                        <Text style={styles.actionText}>modify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShowModal}>
                        <MaterialIcons name="delete" size={18} color="red" />
                        <Text style={{ ...styles.actionText, color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                </View>
                }

            </LinearGradient>

            <DeleteModalComponent title="commentaire" isVisible={isModalVisible} onClose={handleHideModal} handleDelete={handelDeleteComment} />
        </View>
    )
}

export default CommentComponent

const styles = StyleSheet.create({
    commentContainer: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    commentGradient: {
        padding: 16,
    },
    commentHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    commentAuthorPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentAuthorInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    commentAuthorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    commentDate: {
        fontSize: 12,
        color: '#777',
    },
    commentContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    updateButton: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginRight: 16,
    },
    commentInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 10, // Espacement entre l'input et le bouton
    },
    buttonUpdate: {
        alignSelf: 'flex-end', // Place le bouton à droite
        width: '30%', // Le bouton est moins large que l'input
        height: 30,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextUpdate: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    updateView: {
        padding: 10,
    }
})