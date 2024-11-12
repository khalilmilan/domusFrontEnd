import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { fetchDiscussion } from '../redux/actions/actionDiscussion';
import { editMessages, makeMessage } from '../redux/actions/actionMessage';

const ChatHeader = ({ otherUser, navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back" size={24} color="#000" />
    </TouchableOpacity>
    
    <View style={styles.headerUserInfo}>
      <Image 
       // source={{ uri: otherUser.avatar }} 
        source={
                                    otherUser.avatar
                                        ? { uri: otherUser.avatar }
                                            : require('../assets/avatar2.png')
                                }
        style={styles.headerAvatar} 
      />
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerName}>{otherUser.name}</Text>
        <Text style={styles.headerStatus}>En ligne</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.headerButton}>
      <Ionicons name="call" size={22} color="#2196F3" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.headerButton}>
      <Ionicons name="videocam" size={22} color="#2196F3" />
    </TouchableOpacity>
  </View>
);

const ChatScreen = ({ navigation,route }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagess, setMessagess] = useState([]);
  const dispatch = useDispatch();
  const [role, setRole] = useState();
  const [userId, setUserId] = useState(null);
  const [otherId,setOtherId] = useState(null)
  const [token, setToken] = useState(null);
  const [discussion,setDiscussion]=useState();
  const [currentUsers,setCurrentUsers] = useState();
  const [otherUsers,setOtherUsers] = useState();
  let idDiscussion=route.params.idDiscussion
  let loadList = route.params.loadList
  const loadMessages = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
      let user = JSON.parse(userDetails);
      setToken(user.token);
      setRole(user.role)
      let idUser = user?.userId;
      setUserId(idUser);
      const result = await dispatch(fetchDiscussion(token, idDiscussion));
      setDiscussion(result);
      const u1 = {
      _id: result.user1?.idUser,
      name: result.user1?.firstName,
      avatar: result.user1?.photo,
      gender:result.user1.gender
      }
      const u2 = {
      _id: result.user2?.idUser,
      name: result.user2.firstName,
      avatar: result.user2.photo,
      gender:result.user2.gender
      }
      if(result.idUser1==user.userId){
         setCurrentUsers(u1);
         setOtherUsers(u2);
         setOtherId(result.idUser2)
         let updateMessages = await dispatch(editMessages(token,idDiscussion,result.idUser2))
          loadList()
      }else{
         setCurrentUsers(u2);
         setOtherUsers(u1)
         setOtherId(result.idUser1)
         let updateMessages = await dispatch(editMessages(token,idDiscussion,result.idUser1))
         loadList()
      }
      const transformedMessages = result.messages.map(message => ({
      _id: message.idMessage,
      text: message.content,
      createdAt: message.date,
      user: {
     _id: message.sender.idUser,
      name: message.sender.firstName,
      avatar:message.sender.photo?message.sender.photo:'https://i.pravatar.cc/300?img=5'
     }
    }));
    setMessagess(transformedMessages)
      const initialMessages = [ 
        {
          _id: 3,
          text: "D'accord, on se voit demain alors ! 😊",
          createdAt: new Date(Date.now() - 60000),
          user: otherUser,
        },
        {
          _id: 2,
          text: 'Je suis disponible vers 14h, ça te va ?',
          createdAt: new Date(Date.now() - 120000),
          user: currentUser,
        },
        {
          _id: 1,
          text: 'Salut ! Tu es libre demain pour le projet ?',
          createdAt: new Date(Date.now() - 180000),
          user: otherUser,
        },
      ];
      setMessages(initialMessages);
      setLoading(false); 
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID', error);
    }
    finally {
      setLoading(false);
    } 
    
  };
  const addMessage = async(chatMessage)=>{
    console.log("otherUsers"+JSON.stringify(otherUsers))
      try{
        const messageChat={  
        "content":chatMessage.text,
        "idSender":chatMessage.user._id,
        "idReciver":otherUsers._id,
        "idDiscussion":idDiscussion,
        "status":0 
        } 
        let enregisterMessage = await dispatch(makeMessage(token,messageChat))
        loadList()
      }catch(error){
        console.log(error)
      }
  }
  const onSend = useCallback((newMessages = []) => {
    setMessagess(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
    addMessage(newMessages[0]);
  }, []);
  useEffect(() => {
    loadMessages();
  }, [userId,otherId]);
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#F0F0F0',
            borderRadius: 20,
            marginBottom: 5,
          },
          right: {
            backgroundColor: '#0084FF',
            borderRadius: 20,
            marginBottom: 5,
          },
        }}
        textStyle={{
          left: {
            color: '#000000',
          },
          right: {
            color: '#FFFFFF',
          },
        }}
      />
    );
  };

  const renderAvatar = (props) => {
    return (
      <Image
      
      //  source={{ uri: props.currentMessage.user.avatar }}

       source={
                                    props.currentMessage.user.avatar!=null
                                        ? { uri: props.currentMessage.user.avatar }
                                            : {uri:"https://i.pravatar.cc/300?img=5"}
                                }
        style={styles.messageAvatar}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
        renderActions={() => (
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="camera" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="image" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="mic" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#0084FF" />
        </View>
      </Send>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0084FF" />
      </View>
    );
  }

  return (
    
   
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
       {messagess != undefined && otherUsers!=undefined && currentUsers!=undefined?(
        <>
      <ChatHeader otherUser={otherUsers} navigation={navigation} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <GiftedChat
          messages={messagess}
          onSend={onSend}
          user={currentUsers}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          placeholder="Message..."
          alwaysShowSend
          showUserAvatar
          scrollToBottom
          infiniteScroll
          isTyping={false}
          timeFormat="HH:mm"
          dateFormat="YYYY/MM/DD"
          messagesContainerStyle={styles.messageContainer}
        />
      </KeyboardAvoidingView></>):null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  backButton: {
    padding: 5,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 5,
  },
  inputToolbar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 5,
  },
  inputPrimary: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    borderWidth: 0,
    paddingHorizontal: 12,
    marginHorizontal: 10,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  inputButton: {
    padding: 5,
    marginRight: 5,
  },
  sendContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default ChatScreen;