import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { Icon } from '@rneui/themed';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db,auth } from '../firebase';

const TeamChatScreen = ({ currentUser, teamId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Charger les messages de l'équipe spécifique
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('teamId', '==', teamId), // Filtrer par équipe
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
          }
        };
      });
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [teamId]);

  const onSend = useCallback(async (newMessages = []) => {
    try {
      const { text } = newMessages[0];
      
      const messageData = {
        text,
        createdAt: serverTimestamp(),
        teamId, // Ajouter l'ID de l'équipe
        user: {
          _id: 6, // Utiliser l'ID de votre système
          name: 'khalil',
          avatar: '' || null
        }
      };

      await addDoc(collection(db, 'messages'), messageData);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  }, [currentUser, teamId]);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Icon
            type="material-community"
            name="send-circle"
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 6,
          name: 'khalil',
          avatar: ''
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        placeholder="Tapez votre message..."
        alwaysShowSend
        scrollToBottom
        renderAvatarOnTop
        showAvatarForEveryMessage
        showUserAvatar
        messagesContainerStyle={styles.messagesContainer}
        timeFormat="HH:mm"
        dateFormat="DD/MM/YYYY"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  }
});

export default TeamChatScreen;
