import { editSurvey, fetchSurvey } from '../../redux/actions/actionSurvey';

import { Formedate } from '../../.expo/utils/formatDate';
import { fetchGroups } from '../../redux/actions/actionGroupe';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Animated,
    Keyboard,
    Modal,
    FlatList,
    ScrollView,
    ActivityIndicator,

} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
const UpdateSurvey = ({ navigation, route }) => {
    let idSurvey = route.params.idSurvey;
    let loadList = route.params.loadList
    const [values, setValues] = useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [groupeToAdd, setGroupeToAdd] = useState([])

    const dispatch = useDispatch();
    const [token,setToken]=useState();
    const [survey,setSurvey]=useState();
    
     const addGroupe = async (groupe) => {
       
        setSurvey({ ...survey, idGroupe: groupe.idGroupe });
       
        setAddModalVisible(false);

    };
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];
    const [loading, setLoading] = useState(true);
     const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let tokens = user.token;
                setToken(tokens)
                const result = await dispatch(fetchSurvey(tokens, idSurvey));
                setSurvey(result)               
                const result2 = await dispatch(fetchGroups(tokens, user.userId))
                setGroupeToAdd(result2)
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
  const renderAvailableUser = ({ item }) => (
    <TouchableOpacity style={styles.availableUserItem} onPress={() => addGroupe(item)}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.label} `}</Text>
      </View>
    </TouchableOpacity>
  );
    const renderAddModal = () => (
       <Modal visible={addModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Groupe</Text>
              <FlatList
                data={groupeToAdd}
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
    );
    useEffect(() => {
        load();
    }, [token])
     const showNotification = () => {
        slideAnim.setValue(-100);
        fadeAnim.setValue(0);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowAlert(false));
        }, 3000);
    };
    const handleSubmit = async () => {
        try {
            Keyboard.dismiss();
            if (!survey.title.trim()) {
                showAlertWithMessage('Please enter a title for this survey');
                return;
            }
            if (!survey.description.trim()) {
                showAlertWithMessage('Please add a description for this survey');
                return;
            }
            if (survey.startDate > survey.endDate) {
                showAlertWithMessage('the start date must be less than the end date !!');
                return;
            }
            if (survey.idGroupe==0) {
                showAlertWithMessage('Please add a group for this survey');
                return;
            }  
            showAlertWithMessage('Survey Edited successfully!', 'success');   
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    
                    const result = await dispatch(editSurvey(token, survey));
                    loadList();
                    navigation.navigate("Moments")
                     setTimeout(() => {
                        navigation.navigate('Moments'); // Remplacez 'TargetScreen' par le nom de l'écran cible
                    }, 1500);
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
    const renderValue = ({ item }) => (
        <View style={styles.participantItem}>
            <TouchableOpacity style={styles.legendItem} onPress={() => { navigation.navigate('UpdateSurveyValue', { surveyValue: item, load: load }) }}>
                <View style={[styles.legendColor, { backgroundColor: item.colorCode ? item.colorCode : "black" }]} />
                <Text style={styles.legendText}>{item.title} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openDeleteTicketModal(item.idTicket)}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );
    const renderValueFooter = () => (
        <TouchableOpacity
            style={styles.addParticipantButton}
            onPress={() => { navigation.navigate('AddSurveyValue', { idSurvey: idSurvey,loadSurveyDetails:load,loadList:loadList }) }
            }
        >
            <MaterialIcons name="add" size={24} color="blue" />
            <Text style={styles.addParticipantText}>Add Value</Text>
        </TouchableOpacity>
    );
const showAlertWithMessage = (message, type = 'error') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        showNotification();
    };

    const handleStartDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setSurvey({ ...survey, startDate: selectedDate });
        }
        if (Platform.OS === 'android') {
                setShowStartDatePicker(false);
            }
    };
    const handleEndDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setSurvey({ ...surveysurvey, endDate: selectedDate });
        }
        if (Platform.OS === 'android') {
                setShowEndDatePicker(false);
            }
    };
    if (loading) {
        return (<ActivityIndicator size="large" color="#0000ff" />);
    }
    return (
        <ScrollView style={styles.container}>
            {/* Alerte améliorée */}
            {showAlert && (
                <Animated.View
                    style={[
                        styles.alert,
                        alertType === 'success' ? styles.alertSuccess : styles.alertError,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.alertContent}>
                        <Ionicons
                            name={alertType === 'success' ? 'checkmark-circle' : 'alert-circle'}
                            size={24}
                            color={alertType === 'success' ? '#fff' : '#fff'}
                        />
                        <Text style={styles.alertText}>{alertMessage}</Text>
                    </View>
                </Animated.View>
            )}

            <Text style={styles.formTitle}>Edit Survey</Text>

            <View style={styles.fieldsetWrapper}>
                <View style={styles.fieldset}>
                    <View style={styles.legendWrapper}>
                        <View style={styles.legendLine} />
                        <View style={styles.legendContainer}>
                            <Ionicons
                                name={'information-circle-outline'}
                                size={18}
                                color="#8A84FF"
                            />
                            <Text style={styles.legend}>Generales informations</Text>
                        </View>
                        <View style={styles.legendLine} />
                    </View>
                    <View style={styles.fieldsetContent}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Survey title</Text>
                            <TextInput
                                key="input-label"
                                style={styles.input}
                                value={survey.title}
                                onChangeText={(text) => setSurvey({ ...survey, title: text })}
                                placeholder="Enter the title..."
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Survey description</Text>
                            <TextInput
                                key="input-description"
                                style={[styles.input, styles.textArea]}
                                value={survey.description}
                                onChangeText={(text) => setSurvey({ ...survey, description: text })}
                                placeholder="Describe your survey..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Survey Groupes    {survey.groupe.label}</Text>

                            <TouchableOpacity
                                style={styles.addParticipantButton}
                                onPress={() => setAddModalVisible(true)
                                }
                            >
                                <Ionicons
                                    name={'people'}
                                    size={18}
                                    color="#8A84FF"
                                />
                                <Text style={styles.addParticipantText}>Add Groupe</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.fieldsetWrapper}>
                <View style={styles.fieldset}>
                    <View style={styles.legendWrapper}>
                        <View style={styles.legendLine} />
                        <View style={styles.legendContainer}>
                            <Ionicons
                                name={'calendar'}
                                size={18}
                                color="#8A84FF"
                            />
                            <Text style={styles.legend}>Date</Text>
                        </View>
                        <View style={styles.legendLine} />
                    </View>
                    <View style={styles.fieldsetContent}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Survey start date </Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowStartDatePicker(!showStartDatePicker)}
                            >
                                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.dateIcon} />
                                <Text style={styles.dateButtonText}>
                                    {Formedate(survey.startDate)}
                                </Text>
                            </TouchableOpacity>

                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={new Date(survey.startDate)}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleStartDateChange}
                                    onRequestClose={() => setPickerVisible(false)}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Survey end date </Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowEndDatePicker(!showEndDatePicker)}
                            >
                                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.dateIcon} />
                                <Text style={styles.dateButtonText}>
                                    {Formedate(survey.endDate)}
                                </Text>
                            </TouchableOpacity>

                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={new Date(survey.endDate)}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleEndDateChange}
                                    onRequestClose={() => setPickerVisible(false)}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Ionicons name="create-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Edit Survey</Text>
            </TouchableOpacity>
            {renderAddModal()}
        </ScrollView>
    );


}
const styles = StyleSheet.create({
    
    fieldset: {
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    legendContainer: {
        position: 'absolute',
        top: -12,
        left: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        zIndex: 1,
    },
    legend: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
    },
    fieldsetContent: {
        padding: 20,
        paddingTop: 25,
    },
    alert: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        borderRadius: 12,
        zIndex: 100,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    alertSuccess: {
        backgroundColor: '#00b894',
    },
    alertError: {
        backgroundColor: '#ff7675',
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    textArea: {
        height: 120,
        paddingTop: 15,
    },
    dateButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: {
        marginRight: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fieldsetWrapper: {
        marginBottom: 25,
        paddingHorizontal: 15,
    },
    fieldset: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    legendWrapper: {
        position: 'absolute',
        top: -14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    legendLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#e0e0e0',
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    legend: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 6,
    },
    fieldsetContent: {
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    textArea: {
        height: 120,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    dateButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: {
        marginRight: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    submitButton: {
        backgroundColor: '#8A84FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -17,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8A84FF',
        marginBottom: 30,
        textAlign: 'center',
    },
	 addParticipantButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
	 addParticipantText: {
        marginLeft: 10,
        color: '#8A84FF',
        fontSize: 14,
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
});


export default UpdateSurvey
