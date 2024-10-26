import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteSurveyById } from '../../redux/actions/actionSurvey';
import { Formedate } from '../../.expo/utils/formatDate';

const SurveyItem = ({survey, index,token,load,role}) => {
  const navigation = useNavigation();
    const dispatch = useDispatch();
    const [visibleMenu, setVisibleMenu] = useState(null);
    const OptionMenu = ({ visible, onDismiss, onEdit, onDelete }) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => onEdit()}
                        >
                            <Text style={styles.textStyle}>Modifier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonDelete]}
                            onPress={onDelete}
                        >
                            <Text style={styles.textStyle}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
    return (
        <View style={[styles.itemContainer, index % 2 === 0 ? styles.evenItem : styles.oddItem]}>
            <TouchableOpacity
                style={styles.eventContent}
                 onPress={() => navigation.navigate('SurveyDetails', { idSurvey: survey.idSurvey })}
                >
                <Text style={styles.eventTitle}>{survey.title}</Text>
                <Text style={styles.creator}> Groupe : {survey.groupe.label} </Text>
                <Text style={styles.creator}> from : {Formedate(survey.startDate)} to  {Formedate(survey.endDate)}</Text>
            </TouchableOpacity>
            {role=="ADMIN"&&<TouchableOpacity onPress={() => setVisibleMenu(survey.idSurvey)}>
                <MaterialIcons name="more-vert" size={24} color="gray" />
            </TouchableOpacity>}
            <OptionMenu
                visible={visibleMenu === survey.idSurvey}
                onDismiss={() => setVisibleMenu(null)}
                onEdit={() => {
                    navigation.navigate('UpdateSurvey', { idSurvey: survey.idSurvey,loadList:load })
                    setVisibleMenu(null);
                }}
                onDelete={async() => {
                    try{
                    const result = await dispatch(deleteSurveyById(token, survey.idSurvey));
                    load()
                    setVisibleMenu(null);     
                    }catch(error){
                        console.log(error)
                    }
                    
                }}
            />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    evenItem: {
        backgroundColor: 'white',
    },
    oddItem: {
        backgroundColor: '#e6e6e6',
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        height: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    deleteItem: {
        marginTop: 10,
    },
    deleteText: {
        color: 'red',
    },
    creator: {
        fontSize: 14,
        fontStyle: 'italic',
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
     modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
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

});
export default SurveyItem