import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const colors = {
  primary: '#4CAF50',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  gray: '#777777',
};

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app/register.php';

const UserProfile = ({ navigation }: { navigation: any }) => {
  const [userData, setUserData] = useState({
    user_id: '',
    name: '',
    email: '',
    phone: '',
    profileType: '',
    profilePicture: require('../../assets/images/user.png'),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    email: '',
    phone: '',
    profileType: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
    
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const setuserprofile = await AsyncStorage.getItem('profile_type');
        console.log(setuserprofile);
        setToken(storedToken);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    
    getToken();
    
    const unsubscribe = navigation?.addListener('focus', () => {
      getToken();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          navigation?.navigate('SignIn');
          return;
        }
        
        const keys = ['sellerId', 'userName', 'userEmail', 'userPhone', 'userProfilePic', 'profileType'];
        const results = await AsyncStorage.multiGet(keys);
        console.log(results);
        
        const storedData = Object.fromEntries(results);
        
        const userId = storedData['sellerId'];
        const userName = storedData['userName'];
        const userEmail = storedData['userEmail'];
        const userPhone = storedData['userPhone'];
        const userProfilePic = storedData['userProfilePic'];
        const userProfileType = storedData['profileType'];
        
        if (userId) {
          setUserData(prev => ({
            ...prev,
            user_id: userId,
            name: userName || prev.name,
            email: userEmail || prev.email,
            phone: userPhone || prev.phone,
            profileType: userProfileType || prev.profileType,
            profilePicture: userProfilePic && userProfilePic !== 'null' && userProfilePic.trim() !== '' && userProfilePic !== 'default-profile-picture-url'
              ? { uri: userProfilePic } 
              : require('../../assets/images/user.png'),
          }));
        }

        if (userId) {
          await fetchLatestUserData(userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    
    const unsubscribe = navigation?.addListener('focus', () => {
      fetchUserData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchLatestUserData = async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?user_id=${userId}`);
      
      if (Array.isArray(response.data)) {
        const userIdNum = parseInt(userId, 10);
        const userData = response.data.find(user => parseInt(user.user_id, 10) === userIdNum);
        
        if (userData) {
          setUserData(prev => ({
            ...prev,
            name: userData.full_name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone_number || prev.phone,
            profileType: userData.profile_type || prev.profileType,
            profilePicture: userData.profile_pic 
              ? { uri: userData.profile_pic} 
              : prev.profilePicture,
          }));

          const updates: [string, string][] = [
            ['userName', userData.full_name || ''],
            ['userEmail', userData.email || ''],
            ['userPhone', userData.phone_number || ''],
            ['profileType', userData.profile_type || ''],
          ];
          
          if (userData.profile_pic) {
            updates.push(['userProfilePic', userData.profile_pic]);
          }
          
          await AsyncStorage.multiSet(updates);
        }
      } else if (response.data && (response.data.full_name || response.data.email || response.data.phone_number)) {
        const user = response.data;

        setUserData(prev => ({
          ...prev,
          name: user.full_name || prev.name,
          email: user.email || prev.email,
          phone: user.phone_number || prev.phone,
          profileType: user.profile_type || prev.profileType,
          profilePicture: user.profile_pic 
            ? { uri: user.profile_pic} 
            : prev.profilePicture,
        }));

        const updates: [string, string][] = [
          ['userName', user.full_name || ''],
          ['userEmail', user.email || ''],
          ['userPhone', user.phone_number || ''],
          ['profileType', user.profile_type || ''],
        ];
        
        if (user.profile_pic) {
          updates.push(['userProfilePic', user.profile_pic]);
        }
        
        await AsyncStorage.multiSet(updates);
      }
    } catch (error) {
      console.error('Error fetching latest user data:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        await uploadProfilePicture(selectedImage.uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  const uploadProfilePicture = async (imageUri: string) => {
    try {
      setIsUploading(true);
      
      // Create form data for the backend upload
      const formData = new FormData();
      formData.append('user_id', userData.user_id);
      formData.append('update_profile_pic', 'true');
      
      // Append the image file
      formData.append('profile_pic', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `profile_${userData.user_id}.jpg`,
      } as any);
      
      // Make the request to the backend
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        const imageUrl = response.data.profile_pic;
        
        // Update local state
        setUserData(prev => ({
          ...prev,
          profilePicture: { uri: imageUrl }
        }));
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('userProfilePic', imageUrl);
        
        Alert.alert('Success', 'Profile picture updated');
      } else {
        throw new Error(response.data.message || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('user_id', userData.user_id);
      formData.append('full_name', editedUserData.name);
      formData.append('email', editedUserData.email);
      formData.append('phone_number', editedUserData.phone);
      formData.append('profile_type', editedUserData.profileType);
      formData.append('update_profile', 'true');

      // Send update request to backend
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        // Update AsyncStorage
        await AsyncStorage.multiSet([
          ['userName', editedUserData.name],
          ['userEmail', editedUserData.email],
          ['userPhone', editedUserData.phone],
          ['profileType', editedUserData.profileType]
        ]);

        // Update local state
        setUserData(prev => ({
          ...prev,
          name: editedUserData.name,
          email: editedUserData.email,
          phone: editedUserData.phone,
          profileType: editedUserData.profileType,
        }));

        // Exit edit mode
        setEditMode(false);

        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.profileContainer}>
      {/* {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      ) : ( */}
        <>
          {/* Profile Picture with Edit Icon */}
          <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage} disabled={isUploading}>
            {isUploading ? (
              <View style={[styles.profilePic, styles.uploadingContainer]}>
                <ActivityIndicator size="small" color={colors.white} />
              </View>
            ) : (
              <>
                <Image
                  source={userData.profilePicture || require('../../assets/images/user.png')}
                  style={styles.profilePic}
                />
                <Ionicons name="camera" size={20} color="#333" style={styles.cameraIcon} />
              </>
            )}
          </TouchableOpacity>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoHeader}>
              <Text style={styles.userName}>{userData.name || 'No Name'}</Text>
              <TouchableOpacity onPress={() => {
                setEditMode(true);
                setEditedUserData({
                  name: userData.name || '',
                  email: userData.email || '',
                  phone: userData.phone || '',
                  profileType: userData.profileType || '',
                });
              }}>
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userDetail}>{userData.email || 'No Email'}</Text>
            <Text style={styles.userDetail}>{userData.phone || 'No Phone'}</Text>
            <Text style={[styles.userDetail, styles.profileTypeLabel]}>
              Profile Type: <Text style={styles.profileTypeValue}>{userData.profileType || 'No Set Profile'}</Text>
            </Text>
          </View>
        </>
      {/* )} */}

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editMode}
        onRequestClose={() => setEditMode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.input}
              value={editedUserData.name}
              onChangeText={(text) => setEditedUserData(prev => ({...prev, name: text}))}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={editedUserData.email}
              onChangeText={(text) => setEditedUserData(prev => ({...prev, email: text}))}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={editedUserData.phone}
              onChangeText={(text) => setEditedUserData(prev => ({...prev, phone: text}))}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            
            {/* Profile Type Selector */}
            <View style={styles.profileTypeSelector}>
              <Text style={styles.profileTypeLabel}>Profile Type:</Text>
              <View style={styles.profileTypeOptions}>
                {['Consumer', 'Crop Farmer', 'Livestock Farmer'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.profileTypeOption,
                      editedUserData.profileType === type && styles.selectedProfileType
                    ]}
                    onPress={() => setEditedUserData(prev => ({...prev, profileType: type}))}
                  >
                    <Text 
                      style={[
                        styles.profileTypeText,
                        editedUserData.profileType === type && styles.selectedProfileTypeText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleEditProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 70,
    height: 70,
    margin: 10,
    opacity: 0.7,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  uploadingContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -1,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  userDetail: {
    fontSize: 14,
    color: colors.gray,
  },
  profileTypeSelector: {
    width: '100%',
    marginBottom: 15,
  },
  profileTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  profileTypeOption: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 2,
  },
  profileTypeLabel: {
    marginTop: 8,
    fontWeight: '500',
  },
  profileTypeValue: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedProfileType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  profileTypeText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedProfileTypeText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    marginBottom: 15,
    paddingVertical: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.gray,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default UserProfile;