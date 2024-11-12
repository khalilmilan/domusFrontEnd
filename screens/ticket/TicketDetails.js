import { editTicket, fetchTicket } from '../../redux/actions/actionTicket';
import {
    SafeAreaView, Image,
    StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator, FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchProject } from '../../redux/actions/actionProject';
const TicketDetails = ({ navigation, route }) => {
    const [ticket, setTicket] = useState()
    let idTicket = route.params.idTicket;
    let idProject = route.params.idProject;
    const [loading, setLoading] = useState(true);
    const [idUser, setIdUser] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addModalStatusVisible, setAddModalStatusVisible] = useState(false);
    const [membres, setMembres] = useState([]);
    const [token, setToken] = useState();
    const [role, setRole] = useState()
    const dispatch = useDispatch();
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let token = user.token;
                setToken(token)
                setIdUser(user.userId);
                setRole(user.role)
                const result = await dispatch(fetchTicket(token, idTicket));
                setTicket(result);
                const result2 = await dispatch(fetchProject(token, idProject))
                if (result.userAffectedTo.idUser != null) {
                    const users = result2.membres.filter(user => user.idUser !== result.userAffectedTo.idUser);
                    setMembres(users)
                } else {
                    setMembres(result2.membres)
                }
                // Faites quelque chose avec profileData ici
            } else {
                console.log("No user details found in AsyncStorage");
            }
        } catch (error) {
            console.error("Error in load function:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, [])
    const addParticipant = async (user) => {
        const affectedTo = user.idUser;
        const ticketUpdated = {
            ...ticket,
            affectedTo
        }
        try {
            let addUser = await dispatch(editTicket(token, ticketUpdated))
            load();
            setAddModalVisible(false);
        } catch (error) {
            console.log("error: " + error)
        }
    };
    const updateStatus = async (status) => {
        const ticketUpdated = {
            ...ticket,
            status
        }
        try {
            let updated = await dispatch(editTicket(token, ticketUpdated))
            load();
            setAddModalStatusVisible(false);
        } catch (error) {
            console.log("error: " + error)
        }
    }
    const renderAvailableUser = ({ item }) => (
        <TouchableOpacity style={styles.availableUserItem} onPress={() => addParticipant(item)}>
            <Image
                source={
                    item.photo
                        ? { uri: item.photo }
                        : item.gender === 'MALE'
                            ? require('../../assets/avatar0.png')
                            : require('../../assets/avatar2.png')
                }
                style={styles.memberPhoto} />
            <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{`${item.firstName} ${item.lastName}`}</Text>
                <Text style={styles.memberEmail}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    );
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topicContainer}>
                    <LinearGradient
                        colors={['#4a90e2', '#63a4ff']}
                        style={styles.topicGradient}
                    >
                        <View style={styles.header}>
                            <Text style={styles.topicTitle}>{ticket.title} </Text>
                        </View>
                        <Text style={styles.topicDescription}>{ticket.description}</Text>
                        <View style={styles.authorContainer}>
                            <Image

                                source={
                                    ticket.user.photo
                                        ? { uri: ticket.user.photo }
                                        : ticket.user.gender === 'MALE'
                                            ? require('../../assets/avatar0.png')
                                            : require('../../assets/avatar2.png')
                                }
                                style={styles.authorPhoto} />
                            <View>
                                <Text style={styles.authorName}>
                                    {`${ticket.user.firstName} ${ticket.user.lastName}`}
                                </Text>
                                <Text style={styles.authorRole}>Créator</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                {ticket.userAffectedTo.idUser != null ?
                    <>
                        <View style={styles.commentsSection}>
                            <Text style={styles.commentsTitle}>Assigned to</Text>
                        </View>
                        <View style={styles.commentContainer}>
                            <LinearGradient
                                colors={['#f7f7f7', '#ffffff']}
                                style={styles.commentGradient}
                            >
                                <View style={styles.commentHeader}>
                                    <Image source={{ uri: ticket.userAffectedTo.photo }} style={styles.commentAuthorPhoto} />
                                    <View style={styles.commentAuthorInfo}>
                                        <Text style={styles.commentAuthorName}>{`${ticket.userAffectedTo.firstName} ${ticket.userAffectedTo.lastName}`}</Text>
                                        <Text style={styles.commentDate}>
                                            Email: {ticket.userAffectedTo.email}
                                        </Text>
                                    </View>
                                </View>
                                {role == "ADMIN" && <View style={styles.commentActions}>
                                    <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalVisible(true)} >
                                        <MaterialIcons name="edit" size={18} color="#4a90e2" />
                                        <Text style={styles.actionText}>modify</Text>
                                    </TouchableOpacity>
                                </View>}
                            </LinearGradient>
                        </View>
                    </> :
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Not Affected yet !</Text>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalVisible(true)} >
                                        <MaterialIcons name="edit" size={18} color="#4a90e2" />
                                        <Text style={styles.actionText}>Affect to</Text>
                        </TouchableOpacity>
                    </View>
                }
                {ticket.userAffectedTo?.idUser==idUser?
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Status:
                        <Text style={{
                            ...styles.ticketStatusValue,
                            color: ticket.status == 1 ? "#FFA07A" : ticket.status == 2 ? "#98FB98" : "#87CEFA"
                        }}>
                            {ticket.status == 1 ? "    To do" : ticket.status == 2 ? "    In progress" : "    Finished"}
                        </Text>
                    </Text>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalStatusVisible(true)} >
                        <MaterialIcons name="edit" size={18} color="#4a90e2" />
                        <Text style={styles.actionText}>modify</Text>
                    </TouchableOpacity>
                </View>:null}
                <Modal visible={addModalVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Affected to</Text>
                            <FlatList
                                data={membres}
                                renderItem={renderAvailableUser}
                                keyExtractor={(item) => item.id}
                                style={styles.availableUserList}
                            />
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
                                onPress={() => setAddModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={addModalStatusVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Status</Text>
                            <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#FFA07A" }}
                                onPress={() => updateStatus(1)}>
                                <View style={styles.memberInfo}>
                                    <Text>To do</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#98FB98" }}
                                onPress={() => updateStatus(2)}>
                                <View style={styles.memberInfo}>
                                    <Text>In Progress</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: "#87CEFA" }}
                                onPress={() => updateStatus(3)}>
                                <View style={styles.memberInfo}>
                                    <Text>Finished</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
                                onPress={() => setAddModalStatusVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#F0F2F5',
    },
    topicContainer: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    topicGradient: {
        padding: 20,
    },
    topicTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#FFFFFF',
    },
    topicDescription: {
        fontSize: 16,
        color: '#E0E0E0',
        marginBottom: 16,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorPhoto: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    authorRole: {
        fontSize: 12,
        color: '#E0E0E0',
    },
    commentsSection: {
        padding: 16,
        justifyContent: 'space-between',
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
        color: '#333',
        justifyContent: 'space-between',
    },
    updateButton: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginRight: 16,
    },
    updateText: {
        fontSize: 14,
        color: 'white',
        marginLeft: 4,
    },
    actionText: {
        fontSize: 14,
        color: '#4a90e2',
        marginLeft: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewParticipant: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        width: "70%",
        height: "70%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonDelete: {
        backgroundColor: "#FF0000",
    },
    buttonCancel: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    buttonCancelModal: {
        marginTop: 15,
        backgroundColor: "#2196F3",
    },
    buttonToDoModal: {
        marginTop: 15,
        backgroundColor: "#FFA07A",
    },
    buttonInProgressModal: {
        marginTop: 15,
        backgroundColor: "#98FB98",
    },
    buttonFinishedModal: {
        marginTop: 15,
        backgroundColor: "#87CEFA",
    },
    titleModal: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: 'bold',
    }, participantItem2: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userItem: {
        padding: 5
    },
    ticketStatusValue: {
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        width: '90%',
        maxHeight: '80%',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        marginRight: 10,
    },
    availableUserList: {
        width: '100%',
    },
    availableUserItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
    },
    memberPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberEmail: {
        fontSize: 14,
        color: 'gray',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
export default TicketDetails
