import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, ListItem } from '@rneui/themed';
import { db,auth } from '../firebase';

const ConversationList = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const userId=6
  useEffect(() => {
    const unsubscribe = db.collection('conversations')
      .where('users', 'array-contains', userId)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setConversations(data);
      });
    return unsubscribe;
  }, [userId]);

  const openChat = (conversationId) => {
    navigation.navigate('Chat', { conversationId, userId });
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openChat(item.id)}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>Dernier message...</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      )}
    />
  );
}
export default ConversationList;