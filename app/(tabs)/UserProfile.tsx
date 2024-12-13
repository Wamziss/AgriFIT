import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const colors = {
  primary: '#4CAF50',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  gray: '#777777',
};

const API_BASE_URL = 'http://192.168.100.51/AgriFIT/register.php';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    user_id: '',
    name: '',
    email: '',
    phone: '',
    profilePicture: require('../../assets/images/user.png'),
  });

  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Fetch user data from AsyncStorage and potentially refresh from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch from AsyncStorage first
        const userId = await AsyncStorage.getItem('sellerId');
        console.log('User ID:', userId);
        const userName = await AsyncStorage.getItem('userName');
        console.log('User Name:', userName);
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userPhone = await AsyncStorage.getItem('userPhone');
        console.log('user phone:', userPhone);
        const userProfilePic = await AsyncStorage.getItem('userProfilePic');

        // Update local state with AsyncStorage data
        setUserData(prev => ({
          ...prev,
          user_id: userId || '',
          name: userName || 'No Name',
          email: userEmail || 'No Email',
          phone: userPhone || 'No Phone',
          profilePicture: userProfilePic ? { uri: userProfilePic } : require('../../assets/images/user.png'),
        }));

        // Optional: Fetch latest data from backend
        if (userId) {
          await fetchLatestUserData(userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch latest user data from backend
  const fetchLatestUserData = async (userId: string) => {
    try {
      // You might need to modify your backend to support fetching a single user by ID
      const response = await axios.get(`${API_BASE_URL}?user_id=${userId}`);
      const user = response.data;

      // Update local state and AsyncStorage with backend data
      setUserData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.phone_number || prev.phone,
        profilePicture: user.profile_pic 
          ? { uri: `http://192.168.100.51/AgriFIT/${user.profile_pic}` } 
          : prev.profilePicture,
      }));

      // Update AsyncStorage
      await AsyncStorage.multiSet([
        ['userName', user.full_name || userData.name],
        ['userEmail', user.email || userData.email],
        ['userPhone', user.phone_number || userData.phone],
      ]);
    } catch (error) {
      console.error('Error fetching latest user data:', error);
    }
  };
  // Image Picker and Upload
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('user_id', userData.user_id);
        formData.append('profile_pic', {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
        formData.append('full_name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone_number', userData.phone);

        // Upload to backend
        const response = await axios.post(API_BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.status === 'success') {
          // Update local state
          setUserData(prev => ({
            ...prev,
            profilePicture: { uri: selectedImage.uri }
          }));

          // Save to AsyncStorage
          await AsyncStorage.setItem('userProfilePic', selectedImage.uri);

          Alert.alert('Success', 'Profile picture updated');
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    }
  };
  // Edit Profile
  const handleEditProfile = async () => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('user_id', userData.user_id);
      formData.append('full_name', editedUserData.name);
      formData.append('email', editedUserData.email);
      formData.append('phone_number', editedUserData.phone);

      console.log('Form Data:', formData);

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
          ['userPhone', editedUserData.phone]
        ]);

        // Update local state
        setUserData(prev => ({
          ...prev,
          name: editedUserData.name,
          email: editedUserData.email,
          phone: editedUserData.phone,
        }));

        // Exit edit mode
        setEditMode(false);

        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.profileContainer}>
      {/* Profile Picture with Edit Icon */}
      <TouchableOpacity style={styles.profilePicContainer} 
      // onPress={pickImage}
      >
        <Image
          source={userData.profilePicture}
          style={styles.profilePic}
        />
        <Ionicons name="camera" size={20} color="#333" style={styles.cameraIcon} />
      </TouchableOpacity>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoHeader}>
          <Text style={styles.userName}>{userData.name}</Text>
          {/* <TouchableOpacity onPress={() => {
            setEditMode(true);
            setEditedUserData({
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            });
          }}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity> */}
        </View>
        <Text style={styles.userDetail}>{userData.email}</Text>
        <Text style={styles.userDetail}>{userData.phone}</Text>
      </View>

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
    // backgroundColor: colors.background,
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
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



// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
// const profilePicture = require('../../assets/images/user.png'); // Replace with actual profile picture'

// const UserProfile = () => {

//   return (
//     <View style={styles.profileContainer}>
//       <TouchableOpacity style={styles.profilePicContainer}>
//         <Image
//           source={profilePicture} // Replace with actual profile picture URL
//           style={styles.profilePic}
//         />
//         <Ionicons name="camera" size={20} color="#333" style={styles.cameraIcon} />
//       </TouchableOpacity>
//       <View style={styles.userInfo}>
//         <Text style={styles.userName}>Hannah M</Text>
//         <Text style={styles.userDetail}>hannah@example.com</Text>
//         <Text style={styles.userDetail}>0745678899</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profilePicContainer: {
//     position: 'relative',
//     marginRight: 15,
//   },
//   profilePic: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: 'gray',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 2,
//   },
//   userInfo: {
//     justifyContent: 'center',
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   userDetail: {
//     fontSize: 14,
//     color: '#777',
//   },
// });

// export default UserProfile;
