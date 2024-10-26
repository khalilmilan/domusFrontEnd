import { StyleSheet, View, TextInput,
 Button, Platform, Text, TouchableOpacity,Modal, FlatList, 
 ScrollView} from 'react-native'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formedate } from '../../.expo/utils/formatDate';
import { editProject, addUserToProject, deleteUserFromProject, fetchProject, getPossibleUser } from '../../redux/actions/actionProject';
const UpdateProject = ({ navigation, route }) => {
    const [project, setProject] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [selectedIdTicket, setSelectedIdTicket] = useState(null)
    const [token, setToken] = useState(null);
    const [userToAdd, setUserToAdd] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteTicketModalVisible, setDeleteTicketModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    let idProject = route.params.idProject
    let loadList = route.params.loadList; 
    const load = async () => {
        try {
            let userDetails = await AsyncStorage.getItem("userDetails");
            if (userDetails != null) {
                let user = JSON.parse(userDetails);
                let tokens = user.token;
                setToken(tokens);
                const result = await dispatch(fetchProject(tokens, idProject));
                console.log("results: " + JSON.stringify(result.membres))
                setProject(result);
                const result2 = await dispatch(getPossibleUser(tokens, idProject))
                setUserToAdd(result2)
                setTitle(result.title)
                setDescription(result.description)
                setStartDate(result.startDate)
                setEndDate(result.endDate)
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
    useEffect(() => {
        load();
    }, [token])
        const isFormValid = title && description && startDate && endDate;
    const handleSubmit = async () => {
        try {
            // Créer l'objet avec les données mises à jour    
            try {
                let userDetails = await AsyncStorage.getItem("userDetails");
                if (userDetails != null) {
                    let user = JSON.parse(userDetails);
                    let token = user.token;
                    const updatedProject = {
                        ...project,
                        title,
                        description,
                        startDate,
                        endDate
                    };
                    const result = await dispatch(editProject(token, updatedProject));
                    loadList()
                    navigation.navigate("Signets")
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
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Update Project</Text>
            <View style={styles.fieldset}>
                <Text style={styles.legend}>Project Details </Text>
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
            <View style={styles.containerDate}>
                <View style={styles.dateContainer}>
                    <Text style={styles.labelText}>start date : {Formedate(startDate)} </Text>
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
                    <Text style={styles.labelText}>end date :{Formedate(endDate)} </Text>
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
                <Text style={styles.submitButtonText}>Add Project</Text>
            </TouchableOpacity>
            
            </View>
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
});
export default UpdateProject