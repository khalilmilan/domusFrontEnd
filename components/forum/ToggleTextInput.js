import React from 'react';
import { View, Modal, Text, Button, StyleSheet } from 'react-native';

const ToggleTextInput = ({ isVisible, question, onClose }) => {


  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} // Fermeture si l'utilisateur appuie en dehors
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.questionText}>{question}</Text>
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur semi-transparente
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});
export default ToggleTextInput;
