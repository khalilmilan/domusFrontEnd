import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  where, 
  doc, 
  setDoc,
  getFirestore
} from 'firebase/firestore';
import { db } from '../firebase';

class ChatService {
  constructor() {
    this.db = db;
  }

  // Initialiser une conversation entre deux utilisateurs
  async initializeChat(currentUser, otherUser) {
    try {
      const chatId = `${Math.min(currentUser.id, otherUser.id)}_${Math.max(currentUser.id, otherUser.id)}`;
      const chatRef = doc(this.db, 'conversations', chatId);
      
      await setDoc(chatRef, {
        participants: [currentUser.id, otherUser.id],
        participantsData: {
          [currentUser.id]: {
            id: currentUser.id,
            displayName: currentUser.nom,
            avatar: currentUser.avatar || null,
          },
          [otherUser.id]: {
            id: otherUser.id,
            displayName: otherUser.nom,
            avatar: otherUser.avatar || null,
          }
        },
        lastUpdated: new Date(),
      }, { merge: true });

      return chatId;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du chat:', error);
      throw error;
    }
  }

  // Écouter les messages d'une conversation
  subscribeToMessages(chatId, callback) {
    const messagesRef = collection(this.db, `conversations/${chatId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      callback(messages);
    });
  }

  // Envoyer un nouveau message
  async sendMessage(chatId, messageData) {
    try {
      const messagesRef = collection(this.db, `conversations/${chatId}/messages`);
      await addDoc(messagesRef, {
        ...messageData,
        createdAt: new Date(),
      });

      const chatRef = doc(this.db, 'conversations', chatId);
      await setDoc(chatRef, {
        lastMessage: {
          text: messageData.text,
          createdAt: new Date()
        },
        lastUpdated: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();