import { fetchTicket } from '../../redux/actions/actionTicket';
import {
    SafeAreaView, Image,
    StyleSheet, Text, View, TouchableOpacity, ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
const TicketDetails = ({ navigation, route }) => {
    const [ticket, setTicket] = useState()
    let idTicket = route.params.idTicket;
    const [loading, setLoading] = useState(true);
    const [idUser, setIdUser] = useState(null);
    const dispatch = useDispatch();
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let token = user.token;
                setIdUser(user.userId);
                const result = await dispatch(fetchTicket(token, idTicket));
                setTicket(result);
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

    const handleSubmit = async () => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;

                    /*  let date = new Date();
                      const comment = {
                          content,
                          idUser,
                          idForum,
                          date
                      };*/
                    // const uiComment = await dispatch(addComment(token, comment));
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
    };
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
                            <TouchableOpacity style={styles.updateButton}
                                onPress={() => { navigation.navigate("UpdateTicket", { ticket: ticket }) }}
                            >

                                <MaterialIcons name="update" size={18} color="white" />
                                <Text style={styles.updateText}>update</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.topicDescription}>{ticket.description}</Text>
                        <View style={styles.authorContainer}>
                            <Image source={{ uri: ticket.user.photo }} style={styles.authorPhoto} />
                            <View>
                                <Text style={styles.authorName}>
                                    {`${ticket.user.firstName} ${ticket.user.lastName}`}
                                </Text>
                                <Text style={styles.authorRole}>Créateur du sujet</Text>
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
                                            {/*format(new Date(item.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })*/}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.commentActions}>
                                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(!isEditing)} >
                                        <MaterialIcons name="edit" size={18} color="#4a90e2" />
                                        <Text style={styles.actionText}>modify</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    </>:
                    <View style={styles.commentsSection}>
                            <Text style={styles.commentsTitle}>Not Affected yet !</Text>
                    </View>
                }

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
       // flex: 1,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
        color: '#333',
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


});
export default TicketDetails
