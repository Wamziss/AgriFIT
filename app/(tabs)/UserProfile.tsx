import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: require('../../assets/images/user.png'),
  });

  // Fetch user data from AsyncStorage or API (assuming AsyncStorage here)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch data from AsyncStorage (if you've stored it there)
        const userName = await AsyncStorage.getItem('userName');
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userPhone = await AsyncStorage.getItem('userPhone');
        const userProfilePic = await AsyncStorage.getItem('userProfilePic'); // URL or local file path

        // Set state with the fetched data
        setUserData({
          name: userName || 'No Name', // Fallback to 'No Name' if not found
          email: userEmail || 'No Email', // Fallback to 'No Email'
          phone: userPhone || 'No Phone', // Fallback to 'No Phone'
          profilePicture: userProfilePic ? { uri: userProfilePic } : require('../../assets/images/user.png'), // Fallback to placeholder image
        });
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity style={styles.profilePicContainer}>
        <Image
          source={userData.profilePicture}
          style={styles.profilePic}
        />
        <Ionicons name="camera" size={20} color="#333" style={styles.cameraIcon} />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userDetail}>{userData.email}</Text>
        <Text style={styles.userDetail}>{userData.phone}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'gray',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetail: {
    fontSize: 14,
    color: '#777',
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
