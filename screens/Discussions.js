import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StatusBar,
  Platform,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDiscussion, fetchDiscussion, fetchDiscussions, fetchPossibleUsers, fetchsDiscussion } from '../redux/actions/actionDiscussion';
import { Formedate } from '../.expo/utils/formatDate';

const Discussions = ({ navigation }) => {
  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [role, setRole] = useState();
  const [discussionss, setDiscussionss] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // État pour contrôler la visibilité du modal
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState();
  const [possibleUsers, setPossibleUsers] = useState([])
  const [filteredDiscussion, setFiltereddiscussion] = useState([]);
    const handleUserSearch = (text) => {
    setUsername(text);
    if (text) {
      setFilteredUsers(
        possibleUsers.filter((user) =>
          (user.firstName + ' ' + user.lastName).toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(possibleUsers);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUsername(user.firstName + ' ' + user.lastName);
    setFilteredUsers([]);
  };

  const handleCreateDiscussion = async() => {
    // Logique pour créer la discussion avec `selectedUser`
    let newDiscussion = {
      "idUser1":userId,
    "idUser2":selectedUser.idUser,
    "status":1
    }
  
    let addDiscuss = await dispatch(addDiscussion(token,newDiscussion))
    navigation.navigate('ChatScreen', 
    { idDiscussion: addDiscuss.idDiscussion,loadList:loadDiscussions })
    setModalVisible(false); // Fermer le modal après la création
  };
  const handleSearch = (text) => {
        setSearchTerm(text);
        const filtered = discussionss.filter((discussion) =>{
          if(userId===discussion.user1.idUser){

              return discussion.user2.lastName.toLowerCase().includes(text.toLowerCase()) || discussion.user1.lastName.toLowerCase().includes(text.toLowerCase())
          }else{
          return discussion.user1.firstName.toLowerCase().includes(text.toLowerCase()) || discussion.user1.lastName.toLowerCase().includes(text.toLowerCase())
          }
        });
        console.log("filtred: "+filtered)
        setFiltereddiscussion(filtered);
    };

  const loadDiscussions = async() => {
    // Simuler le chargement des discussions depuis une API
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");  // Récupère l'ID du stockage
      let user = JSON.parse(userDetails);
      setToken(user.token);
      setRole(user.role)
      let idUser = user.userId;
      setUserId(idUser);
      const result = await dispatch(fetchDiscussions(token, idUser));
      setDiscussionss(result);
      setFiltereddiscussion(result)
      const resultUsers = await dispatch(fetchPossibleUsers(token,idUser));
      setPossibleUsers(resultUsers)
      setFilteredUsers(resultUsers)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID', error);
    }
    finally {
      setLoading(false);
    }
 
};
 useEffect(() => {
    loadDiscussions();
  }, [token ]);

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      <Text style={styles.headerTitle}>Discussions</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={handleSearch}
        placeholderTextColor="#8E8E93"
      />
    </View>
  </View>
);

const renderDiscussionItem = ({ item }) => (
  <TouchableOpacity
    style={styles.discussionItem}
    onPress={() => navigation.navigate('ChatScreen', 
    { idDiscussion: item.idDiscussion,loadList:loadDiscussions })}
  >
    <View style={styles.avatarContainer}>
      <Image 
      
      source={
        item.idUser1==userId?
                item.user2.photo
                ? {uri: item.user2.photo}
                : item.user2.gender === 'MALE'
                ? require('../assets/avatar0.png')
                : require('../assets/avatar2.png')
            :
            item.user1.photo
                ? {uri: item.user1.photo}
                : item.user1.gender === 'MALE'
                ? require('../assets/avatar0.png')
                : require('../assets/avatar2.png')
              }
      style={styles.avatar} /> 
      {/*item.online && <View style={styles.onlineBadge} />*/}
    </View>
    <View style={styles.discussionContent}>
      <View style={styles.discussionHeader}>
        <View>
          <Text style={styles.userName}>
            {
            item.idUser1==userId?
            `${item.user2.firstName} ${item.user2.lastName}`
            :
            `${item.user1.firstName} ${item.user1.lastName}`
            }
            </Text>
          <Text style={styles.userEmail}>
            {item.idUser1==userId?
            `${item.user2.email}`
            :
            `${item.user1.email}`
            }
            </Text>
        </View>
        <Text style={styles.timestamp}>{Formedate(item.lastMessage.date)}</Text>
      </View>
      <View style={styles.lastMessageContainer}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          { item.lastMessage.content}
        </Text>
        {item.countMessageNotSeen > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.countMessageNotSeen}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <Header />
    <FlatList
      data={filteredDiscussion}
      renderItem={renderDiscussionItem}
      keyExtractor={item => item.idDiscussion}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
     <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle Discussion</Text>
            <TextInput
              style={styles.input}
              placeholder="search user"
              value={username}
              onChangeText={handleUserSearch}
            />
            {filteredUsers!=undefined && filteredUsers.length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                    <Image 
                    source={
                            item.photo
                                ? { uri: item.photo }
                                : item.gender === 'MALE'
                                    ? require('../assets/avatar0.png')
                                    : require('../assets/avatar2.png')
                        }
                    style={styles.userPhoto} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateDiscussion}>
              <Text style={styles.createButtonText}>Created</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.cancelButton} onPress={()=>setModalVisible(false)}>
              <Text style={styles.createButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </SafeAreaView>
);
}

export default Discussions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
   container: {
    flex: 1,
    justifyContent: 'center',
   // alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    height: '100%',
  },
  listContainer: {
    paddingVertical: 8,
  },
  discussionItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  discussionContent: {
    flex: 1,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666666',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    width: '100%',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});