import {
    View, Text,
    StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchSurvey } from '../../redux/actions/actionSurvey';
import { isExists } from 'date-fns';
import { Formedate } from '../../.expo/utils/formatDate';
import { MaterialIcons } from '@expo/vector-icons';
import { addVote, editVote } from '../../redux/actions/actionVote';

const SurveyDetails = ({ navigation, route }) => {
    const [survey, setSurvey] = useState(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [idUser, setIdUser] = useState();
    const [results, setResults] = useState();
    const [isExistsResult, setIsExistsResult] = useState(false)
    const [totalVotes, setTotalVotes] = useState()
    const [role, setRole] = useState();
    const [addModalVoteVisible, setAddModalVoteVisible] = useState(false);
    const [participantVote, setParticipantVote] = useState(null);
    let idSurvey = route.params.idSurvey;

    const calculDataVote = (data) => {
        let values = data.values
        let votes = data.votes
        let totalvote = data.votes.length
        setTotalVotes(totalvote)
        let vp = votes.filter(vote => vote.idUser === idUser);
        if (vp.length > 0) {
            setParticipantVote(vp[0]) 
        } 
        const resultat = values.map(value => {
            const nombreVotes = votes.filter(vote => vote.idSurveyValue === value.idSurveyValue).length;
            let population = (nombreVotes / totalvote) * 100;
            return {
                name: value.title,
                population: population,
                color: value.colorCode
            };
        });
        setResults(resultat);
        setIsExistsResult(true);
    }
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let tokens = user.token;
                setToken(tokens);
                setRole(user.role);
                setIdUser(user.userId);
                const result = await dispatch(fetchSurvey(tokens, idSurvey));
                setSurvey(result);
                if (result.values.length > 0 && result.votes.length > 0) {
                    calculDataVote(result)
                }
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
    }, [idUser])

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        useShadowColorFromDataset: false
    };
    const makeVote = async (idSurveyValue) => {
        if(participantVote==null){
           
        let vote = {
            title: " ",
            idUser,
            idSurvey: survey.idSurvey,
            idSurveyValue,
            "status": 1
        }
        let awaitVote = await dispatch(addVote(token, vote));
        }else{
            
            let vote={
                ...participantVote,
                idSurveyValue
            }
           let awaitVote = await dispatch(editVote(token, vote));
        }
        load();
        setAddModalVoteVisible(false)

    }
    const screenWidth = Dimensions.get("window").width;
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    } else {
        return (
            <ScrollView style={styles.container}>
                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={styles.headerGradient}
                >
                    <Text style={styles.title}>{survey.title}</Text>
                    <Text style={styles.subtitle}>Groupe: {survey.groupe.label} </Text>
                    <Text style={styles.subtitle}>Conducted from {Formedate(survey.startDate)} to {Formedate(survey.endDate)}</Text>
                </LinearGradient>
                {isExistsResult &&
                    <>
                        <View style={styles.card}>
                            <Text style={styles.description}>{survey.description}</Text>
                            {role == "ADMIN" && <View style={styles.chartContainer}>
                                <PieChart
                                    data={results}
                                    width={screenWidth - 60}
                                    height={220}
                                    chartConfig={chartConfig}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>}

                            <View style={styles.legendContainer}>
                                <Text style={styles.optiontitle}>Options :</Text>
                                {results.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText}>{item.name} {role == "ADMIN" ? `: ${item.population} %` : null}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.statsContainer}>
                                {role == "ADMIN" && <Text style={styles.statsText}>Total des votes: {totalVotes}</Text>}
                            </View>
                            {role == "ADMIN" ?
                                <TouchableOpacity style={styles.shareButton}/* onPress={onShare}*/>
                                    <Text style={styles.shareButtonText}>Partager les résultats</Text>
                                </TouchableOpacity>
                                : participantVote == null ?
                                    <View style={styles.voteContainer}>
                                        <TouchableOpacity style={styles.voteButton} onPress={() => setAddModalVoteVisible(true)}>
                                            <Text style={styles.shareButtonText}>
                                                <MaterialIcons name="how-to-vote" size={24} color="white" /> vote
                                            </Text>
                                        </TouchableOpacity>
                                    </View> :
                                    participantVote?<View style={styles.commentsSection}>
                                        <Text style={styles.commentsTitle}>Your vote:
                                            <Text style={{
                                                ...styles.ticketStatusValue,
                                                color: participantVote.surveyValuedto.colorCode
                                            }}>
                                                {"  "+participantVote.surveyValuedto.title}
                                            </Text>
                                        </Text>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalVoteVisible(true)} >
                                            <MaterialIcons name="edit" size={18} color="#4a90e2" />
                                            <Text style={styles.actionText}>modify</Text>
                                        </TouchableOpacity>
                                    </View>:null
                            }
                        </View>
                    </>}
                <Modal visible={addModalVoteVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Options</Text>
                            {survey.values.map((item, index) => (
                                <TouchableOpacity style={{ ...styles.availableUserItem, backgroundColor: item.colorCode }}
                                    onPress={() => makeVote(item.idSurveyValue)}>
                                    <View style={styles.optionInfo}>
                                        <Text style={{ color: "white" }}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]}
                                onPress={() => setAddModalVoteVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    headerGradient: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#ddd',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        lineHeight: 24,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    legendContainer: {
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    legendText: {
        fontSize: 16,
        color: '#333',
    },
    statsContainer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        justifyContent: "center"
    },
    voteContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',   
    },
    statsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    shareButton: {
        backgroundColor: '#4c669f',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    voteButton: {
        backgroundColor: '#4c669f',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        width: "50%",
        justifyContent: "center",
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optiontitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
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
    memberInfo: {
        flex: 1,
    },
    optionInfo: {
        flex: 1,
        color: "white"
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    availableUserItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    availableUserList: {
        width: '100%',
    },
      commentsSection: {
        padding: 10,
       // justifyContent: 'space-between',
    },
    commentsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
       // margin: 16,
        color: '#333',
        justifyContent: 'space-between',
    },
    ticketStatusValue: {
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
     actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
      actionText: {
        fontSize: 14,
        color: '#4a90e2',
        marginLeft: 4,
    },
});
export default SurveyDetails

