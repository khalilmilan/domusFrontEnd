



import { fetchSurvey } from '../../redux/actions/actionSurvey';

import { addVote, editVote } from '../../redux/actions/actionVote';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Button } from '@rneui/themed'; // Importer le bouton d'@rneui
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
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
                console.log(result)
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
        if (participantVote == null) {
            let vote = {
                title: " ",
                idUser,
                idSurvey: survey.idSurvey,
                idSurveyValue,
                "status": 1
            }
            let awaitVote = await dispatch(addVote(token, vote));
        } else {

            let vote = {
                ...participantVote,
                idSurveyValue
            }
            let awaitVote = await dispatch(editVote(token, vote));
        }
        load();
        setAddModalVoteVisible(false)
    }
    // Exemple de données pour le PieChart
    // Infos du sondage
    const surveyInfo = {
        title: "Survey on Customer Satisfaction",
        groupName: "Marketing Team",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        description: "This survey helps us understand customer satisfaction and gather feedback on our services."
    };

    // Fonction de partage
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Survey Results: \nTitle: ${surveyInfo.title}\nGroup: ${surveyInfo.groupName}\nStart Date: ${surveyInfo.startDate}\nEnd Date: ${surveyInfo.endDate}\nResults: ${surveyData.map(option => `${option.name}: ${option.population}%`).join('\n')}`,
            });
        } catch (error) {
            console.error("Error sharing: ", error.message);
        }
    };

    // Rediriger vers la page d'options
    const handleOptionsClick = () => {
        navigation.navigate('ListSurveyValue', { idSurvey: idSurvey }); // Changez 'SurveyOptions' avec le nom de votre screen
    };
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);  // Afficher un indicateur de chargement
    } else {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{survey.title}</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            <Text style={styles.bold}>Group: </Text>{survey.groupe.label}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.bold}>Start Date: </Text>{survey.startDate}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.bold}>End Date: </Text>{survey.endDate}
                        </Text>
                    </View>
                </View>


                {role=="ADMIN"?<View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{survey.description}</Text>
                    <Text style={styles.link} onPress={handleOptionsClick}>
                        View Options
                    </Text>
                </View>
                :
                <View style={styles.legendContainer}>
                            <Text style={styles.optiontitle}>Options :</Text>
                            {results.map((item, index) => (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                    <Text style={styles.legendText}>{item.name} {role == "ADMIN" ? `: ${item.population} %` : null}</Text>
                                </View>
                            ))}
                </View>}
                {participantVote == null ?
                    <View style={styles.voteContainer}>
                        <TouchableOpacity style={styles.voteButton} onPress={() => setAddModalVoteVisible(true)}>
                            <Text style={styles.shareButtonText}>
                                <MaterialIcons name="how-to-vote" size={24} color="white" /> vote
                            </Text>
                        </TouchableOpacity>
                    </View> :
                    participantVote ? <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Your vote:
                            <Text style={{
                                ...styles.ticketStatusValue,
                                color: participantVote.surveyValuedto.colorCode
                            }}>
                                {"  " + participantVote.surveyValuedto.title}
                            </Text>
                        </Text>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalVoteVisible(true)} >
                            <MaterialIcons name="edit" size={18} color="#4a90e2" />
                            <Text style={styles.actionText}>modify</Text>
                        </TouchableOpacity>
                    </View> : null
                }
                {isExistsResult && role == "ADMIN" &&
                    <>
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={results}
                                width={350}
                                height={220}
                                chartConfig={styles.chartConfig}
                                accessor="population"
                                backgroundColor="transparent"
                            />
                        </View>


                        {/* Share Button Section */}
                        <View style={styles.shareButtonContainer}>
                            <Button
                                title="Share Results"
                                onPress={handleShare}
                                buttonStyle={styles.shareButton}
                                titleStyle={styles.shareButtonTitle}
                            />
                        </View>
                    </>
                }
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
        );
    }
}
const styles = StyleSheet.create({
    voteContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f7f8f9', // Fond clair pour une interface moderne
        padding: 20,
    },
    headerContainer: {
        marginBottom: 25,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd', // Bordure pour séparer le header
        paddingBottom: 15,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Montserrat',
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 10,
    },
    infoContainer: {
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: '#7f8c8d',
        textAlign: 'center',
        marginVertical: 5,
    },
    bold: {
        fontWeight: '700',
        color: '#34495e',
    },
    descriptionContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 22,
    },
    link: {
        color: '#3498db',
        fontSize: 18,
        fontFamily: 'Montserrat',
        fontWeight: '600',
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 20,
    },
    chartContainer: {
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5, // Ombre pour Android
    },
    chartConfig: {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    },
    shareButtonContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    shareButton: {
        backgroundColor: '#3498db',
        borderRadius: 50,
        paddingVertical: 15,
        width: '100%',
    },
    shareButtonTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
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
        optiontitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
    },
    
});
export default SurveyDetails

