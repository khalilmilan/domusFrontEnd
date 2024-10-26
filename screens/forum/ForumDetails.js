import {
    SafeAreaView, FlatList, Image,
    StyleSheet, Text, View, TouchableOpacity, ActivityIndicator,
    ScrollView
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchForum } from '../../redux/actions/actionForum';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { addComment } from '../../redux/actions/actionComment';
import CommentComponent from '../../components/forum/CommentComponent';

const ForumDetails = ({ navigation, route }) => {
    const [forum, setForum] = useState()
    let idForum = route.params.idForum;
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('')
    const [idUser, setIdUser] = useState(null);
    const [role,setRole] = useState();
    const dispatch = useDispatch();
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let token = user.token;
                setIdUser(user.userId);
                setRole(user.role);
                const result = await dispatch(fetchForum(token, idForum));
                setForum(result);
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

                    let date = new Date();
                    const comment = {
                        content,
                        idUser,
                        idForum,
                        date
                    };
                    const uiComment = await dispatch(addComment(token, comment));
                    load();
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
            <ScrollView style={styles.container}>
                <View style={styles.topicContainer}>
                    <LinearGradient
                        colors={['#4a90e2', '#63a4ff']}
                        style={styles.topicGradient}
                    >
                        <View style={styles.header}>
                            <Text style={styles.topicTitle}>{forum.title} </Text>
                            
                            {role=="ADMIN"&&<TouchableOpacity style={styles.updateButton}
                                onPress={() => { navigation.navigate("UpdateForum", { forum: forum,loadForumDetails:load }) }}
                            >
                                <MaterialIcons name="update" size={18} color="white" />
                                <Text style={styles.updateText}>update</Text>
                            </TouchableOpacity>}
                        </View>
                        <Text style={styles.topicDescription}>{forum.description}</Text>
                        <View style={styles.authorContainer}>
                            <Image source={{ uri: forum.user.photo }} style={styles.authorPhoto} />
                            <View>
                                <Text style={styles.authorName}>
                                    {`${forum.user.firstName} ${forum.user.lastName}`}
                                </Text>
                                <Text style={styles.authorRole}>Créateur du sujet</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments</Text>
                    <FlatList
                        data={forum.comments}
                        renderItem={({ item }) => <CommentComponent item={item} idUser={idUser} loadComments={load} />}
                        keyExtractor={(item) => item.idCommentaire.toString()}
                        contentContainerStyle={styles.commentsList}
                    />
                    <View style={styles.updateView}>
                        <TextInput
                            placeholder="write a comment"
                            value={content}
                            style={styles.commentInput}
                            onChangeText={setContent}
                        />
                        <TouchableOpacity style={styles.buttonUpdate} onPress={handleSubmit}>
                            <Text style={styles.buttonTextUpdate}>Add comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default ForumDetails


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
      
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
        color: '#007bff',
    },
    commentsList: {
        padding: 8,
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
});