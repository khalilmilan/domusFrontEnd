import {
    StyleSheet, Text, View, Platform,
    TextInput, TouchableOpacity, Button, FlatList,
    Modal
} from 'react-native'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addSurvey } from '../../redux/actions/actionSurvey';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchGroups } from '../../redux/actions/actionGroupe';
const AddSurvey = ({ navigation, route }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [groupeToAdd, setGroupeToAdd] = useState([])
    const [idGroupe, setIdGroupe] = useState();
    const [groupeName, setGroupeName] = useState('');
    let loadSurveyList = route.params.loadList
    const showStartDatepicker = () => {
        setShowStart(true);
    };
    const showEndDatepicker = () => {
        setShowEnd(true);
    };
    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowStart(Platform.OS === 'ios');
        setStartDate(currentDate);
    };
    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowEnd(Platform.OS === 'ios');
        setEndDate(currentDate);
    };
    const addGroupe = async (groupe) => {
        setIdGroupe(groupe.idGroupe);
        setGroupeName(groupe.label);
        setAddModalVisible(false);

    };
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
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let token = user.token;
                const result2 = await dispatch(fetchGroups(token, user.userId))
                setGroupeToAdd(result2)
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
                    let idUser = user.userId
                    const survey = {
                        title,
                        idUser,
                        description,
                        idGroupe,
                        startDate,
                        endDate
                    };
                    const uiProject = await dispatch(addSurvey(token, survey));
                    loadSurveyList()
                    navigation.navigate('Moments')
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

    const dispatch = useDispatch();
    const isFormValid = title && description && startDate && endDate &&groupeName;
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Add Survey</Text>
            <View style={styles.fieldset}>
                <Text style={styles.legend}>Survey Details </Text>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Label</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez un label"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.labelText}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder="Entrez une description"
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
                        numberOfLines={4}
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.formeView}>
                <Text style={styles.participantsTitle}>Groupe :{groupeName}</Text>
                <TouchableOpacity
                    style={styles.addParticipantButton}
                    onPress={() => setAddModalVisible(true)
                    }
                >
                    <MaterialIcons name="group-add" size={24} color="blue" />
                    <Text style={styles.addParticipantText}>Add Groupe</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerDate}>
                <View style={styles.dateContainer}>
                    <Text style={styles.labelText}>start date : </Text>
                {showStart && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(startDate)}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeStartDate}
                    />
                )}
                <TouchableOpacity onPress={showStartDatepicker} style={styles.button}>
                        <MaterialIcons name="event-note" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.containerDate}>
                <View style={styles.dateContainer}>
                    <Text style={styles.labelText}>end date : </Text>
                {showEnd && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(endDate)}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeEndDate}
                    />
                )}
                <TouchableOpacity onPress={showEndDatepicker} style={styles.button}>
                        <MaterialIcons name="event-note" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
            </View>
             <TouchableOpacity style={styles.submitButton} 
             onPress={handleSubmit}
             disabled={!isFormValid}
             >
                <Text style={styles.submitButtonText}>Add Survey</Text>
            </TouchableOpacity>
            </View>
            {renderAddModal()}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f4f6f9', // Couleur douce pour le fond
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    fieldset: {
        padding: 15,
        borderColor: '#007bff', // Bordure bleue
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    legend: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#007bff',
    },
    field: {
        marginBottom: 20,
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#e9ecef', // Légèrement coloré pour les champs
        color: '#333', // Texte dans les champs
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333', // Couleur du texte de la date
    },
    datePicker: {
        marginTop: 20, // Corrige la position du DatePicker
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
     containerDate: {
        flexDirection: 'row',
        marginBottom: 15,
        padding: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    dateText: {
        fontSize: 10,
    },
    formeView: {
        flexDirection: "row",
        padding: 10,
    },
    addParticipantButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
       addParticipantText: {
        marginLeft: 10,
        color: 'blue',
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

export default AddSurvey

