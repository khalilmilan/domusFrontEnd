import { StyleSheet, Text, View,Modal,TouchableOpacity } from 'react-native'

import React, { useEffect, useState } from 'react'

const AddParticipant = (addModalVisible) => {
    const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => setAddModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Sélectionnez un utilisateur à ajouter :</Text>
        {/*  <FlatList
            data={allUsers.filter(user => !event.participants.some(p => p.id === user.id))}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => addParticipant(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
          />
          */}
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel]}
            onPress={() => setAddModalVisible(false)}
          >
            <Text style={styles.textStyle}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default AddParticipant

const styles = StyleSheet.create({})