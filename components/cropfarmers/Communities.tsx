import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app';

type Community = {
  forum_id: string;
  name: string;
  description: string;
  members_count: number;
};

type ForumPost = {
  post_id: string;
  content: string;
  created_by: string;
  created_at: string;
};

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#888888',
  border: '#E0E0E0',
};

const Communities: React.FC = () => {
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [userPhone, setUserPhone] = useState('012345678'); // Replace with actual user phone
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserPhone = async () => {
      try {
        // Fetch from AsyncStorage first
        const userId = await AsyncStorage.getItem('sellerId');
        console.log('User ID:', userId);
        const userName = await AsyncStorage.getItem('userName');
        console.log('User Name:', userName);
        const userPhone = await AsyncStorage.getItem('userPhone');
        console.log('user phone:', userPhone);
  
        // Update local state with AsyncStorage data
        if (userPhone !== null) {
          setUserPhone(userPhone);
        }

        // Optional: Fetch latest data from backend
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserPhone();    
    fetchCommunities();
  }, []);


  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Then replace axios calls with api
  const fetchCommunities = async () => {
    try {
      const response = await api.get('/cropforum.php');
      console.log('Fetch Crop communities Response:', response.data);
      setCommunities(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch Communities Error:', error.message);
        Alert.alert('Error', 'Failed to fetch communities: ' + error.message);
      } else {
        console.error('Fetch Communities Error:', String(error));
        Alert.alert('Error', 'Failed to fetch communities: An unknown error occurred');
      }
    }

  };
  const handleCreateCommunity = async () => {
    if (!newCommunityName || !newCommunityDescription) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/cropforum.php`, {
        name: newCommunityName,
        description: newCommunityDescription,
        created_by: userPhone,
      });

      if (response.data.success) {
        fetchCommunities();
        setNewCommunityName('');
        setNewCommunityDescription('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create community');
    }
  };

  const handleJoinCommunity = async (forumId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/cropforum.php`, {
        forum_id: forumId,
        user_phone: userPhone,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Joined community successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join community');
    }
  };

  const fetchForumPosts = async (forumId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cropforum_post.php?forum_id=${forumId}`);
      setPosts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/cropforum_post.php`, {
        forum_id: selectedCommunity?.forum_id,
        created_by: userPhone,
        content: newPostContent,
      });

      if (response.data.success) {
        fetchForumPosts(selectedCommunity?.forum_id || '');
        setNewPostContent('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const renderCommunity = ({ item }: { item: Community }) => (
    <View style={styles.communityCard}>
      <Text style={styles.communityTitle}>{item.name}</Text>
      <Text style={styles.communityDescription}>{item.description}</Text>
      <Text style={styles.communityMembers}>{item.members_count} members</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={() => handleJoinCommunity(item.forum_id)}
        >
          <Ionicons name="people-outline" size={16} color={colors.white} />
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.viewPostsButton} 
          onPress={() => {
            setSelectedCommunity(item);
            fetchForumPosts(item.forum_id);
            setIsPostModalVisible(true);
          }}
        >
          <Ionicons name="chatbubbles-outline" size={16} color={colors.white} />
          <Text style={styles.joinButtonText}>Posts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = ({ item }: { item: ForumPost }) => (
    <View style={styles.postCard}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postMeta}>
        By: {item.created_by} | {new Date(item.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Crop Farming Communities</Text>

      <FlatList
        data={communities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.forum_id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.createCommunityContainer}>
        <Text style={styles.createCommunityTitle}>Create a New Community</Text>
        <TextInput
          value={newCommunityName}
          onChangeText={setNewCommunityName}
          placeholder="Community Name"
          style={styles.input}
        />
        <TextInput
          value={newCommunityDescription}
          onChangeText={setNewCommunityDescription}
          placeholder="Community Description"
          style={styles.input}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCommunity}>
          <Ionicons name="add-outline" size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create Community</Text>
        </TouchableOpacity>
      </View>

      {/* Forum Posts Modal */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCommunity?.name} Forum</Text>
            <TouchableOpacity onPress={() => setIsPostModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.post_id}
            ListEmptyComponent={
              <Text>No posts yet</Text>
            }
          />

          <View style={styles.createCommunityContainer}>
            <TextInput
              value={newPostContent}
              onChangeText={setNewPostContent}
              placeholder="Write a post..."
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
              <Ionicons name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  communityCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  communityDescription: {
    fontSize: 14,
    color: colors.grey,
    marginVertical: 5,
  },
  communityMembers: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  createCommunityContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  createCommunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewPostsButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  postCard: {
    backgroundColor: colors.background,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  postContent: {
    fontSize: 16,
    color: colors.text,
  },
  postMeta: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 5,
  },
  PostContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 5,
  },
  PostImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
  },
  PostContent: {
  flex: 1,
  },
  PostTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.text,
  },
  PostDescription: {
  fontSize: 1,
  color: colors.grey,
  margin: 3,
  },

});

export default Communities;
