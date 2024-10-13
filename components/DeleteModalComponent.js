import { 
 StyleSheet, Text, View, TouchableOpacity,Modal } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useDispatch } from 'react-redux';
const DeleteModalComponent = ({title,isVisible, onClose,handleDelete}) => {
    
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer ce {title} ?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={handleDelete}
            >
              <Text style={styles.textStyle}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteModalComponent

const styles = StyleSheet.create({
     centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width:"80%"
    },
     modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
   button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 60,
    marginTop: 10
  },
   buttonCancel: {
    backgroundColor: "#2196F3",
  },
    textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
   buttonDelete: {
    backgroundColor: "#FF0000",
  },
})