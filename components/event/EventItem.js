
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../../redux/actions/actionEvent';


const EventItem = ({event,index,token,role,loadList }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [visibleMenu, setVisibleMenu] = useState(null);
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Gérer le cas où dateString est undefined ou null
        const date = parseISO(dateString);
        return format(date, 'dd-MM-yyyy');
    };
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
                onPress={() => navigation.navigate('EventDetails', { eventId: event.idEvent })}>
                <Text style={styles.eventTitle}>{event.label}</Text>
                <Text>date: {event.date}</Text>
                <Text style={styles.creator}>{`Created by : ${event.user.firstName} ${event.user.lastName}`}</Text>

            </TouchableOpacity>
            {role=="ADMIN"&&<TouchableOpacity onPress={() => setVisibleMenu(event.idEvent)}>
                <MaterialIcons name="more-vert" size={24} color="gray" />
            </TouchableOpacity>}
            <OptionMenu
                visible={visibleMenu === event.idEvent}
                onDismiss={() => setVisibleMenu(null)}
                onEdit={() => {
                    //navigation.navigate('EditEvent', { eventId: item.id });
                    navigation.navigate('EditEvent', { eventId: event.idEvent })
                    setVisibleMenu(null);
                }}
                onDelete={async() => {
                    
                    const result = await dispatch(deleteEvent(token, event.idEvent));
                    loadList()
                    setVisibleMenu(null);
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

export default EventItem;