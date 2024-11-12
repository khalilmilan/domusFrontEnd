import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { ListItem, Avatar, Text } from '@rneui/themed';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utilisateur de test - À remplacer par votre système d'authentification
  const currentUser = {
    id: "user123",
    nom: "Thomas Martin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  };

  useEffect(() => {
    // Référence à la collection conversations
    const conversationsRef = collection(db, 'conversations');
    
    // Créer une requête pour obtenir toutes les conversations de l'utilisateur
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', currentUser.id),
      orderBy('lastUpdated', 'desc')
    );

    // S'abonner aux changements
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsList = snapshot.docs.map(doc => {
        const data = doc.data();
        // Trouver l'autre participant
        const otherUserId = data.participants.find(id => id !== currentUser.id);
        const otherUser = data.participantsData[otherUserId];
        
        return {
          id: doc.id,
          otherUser,
          lastMessage: data.lastMessage,
          lastUpdated: data.lastUpdated?.toDate(),
          unreadCount: data.unreadCount || 0
        };
      });

      setConversations(conversationsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatLastMessageTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'à l\'instant';
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', {
          chatId: item.id,
          currentUser,
          otherUser: item.otherUser
        })}
      >
        <ListItem bottomDivider>
          <Avatar
            rounded
            source={{ uri: item.otherUser.avatar }}
            size="medium"
          />
          <ListItem.Content>
            <ListItem.Title style={styles.userName}>
              {item.otherUser.displayName}
            </ListItem.Title>
            <ListItem.Subtitle 
              style={styles.lastMessage}
              numberOfLines={1}
            >
              {item.lastMessage?.text || 'Aucun message'}
            </ListItem.Subtitle>
          </ListItem.Content>
          <View style={styles.rightContent}>
            <Text style={styles.time}>
              {formatLastMessageTime(item.lastUpdated)}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </ListItem>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2089dc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucune conversation
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
  },
  lastMessage: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  badge: {
    backgroundColor: '#2089dc',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ConversationsScreen;