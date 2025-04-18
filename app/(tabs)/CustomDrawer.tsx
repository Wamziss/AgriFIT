import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import UserProfile from './UserProfile'; // Import the UserProfile component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


const CustomDrawer = ({ navigation, selectedProfile }: { navigation: any; selectedProfile: string }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [profile, setProfile] = useState<'Consumer' | 'Crop Farmer' | 'Livestock Farmer'>('Consumer');
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const profileMenuItems: {
    [key in 'Consumer' | 'Crop Farmer' | 'Livestock Farmer']: Array<{
      label: string;
      action: () => void;
      icon: string;
    }>;
  } = {
    Consumer: [
      { label: 'Dashboard', action: () => navigation.navigate('ConsumerHome'), icon: 'home' },
      { label: 'Cart', action: () => navigation.navigate('Cart'), icon: 'cart' },
      // { label: 'Orders', action: () => navigation.navigate('Orders'), icon: 'clipboard' },
      { label: 'My Products', action: () => navigation.navigate('My Products'), icon: 'pricetag' },
    ],
    'Crop Farmer': [
      { label: 'Dashboard', action: () => navigation.navigate('Crop FarmerHome'), icon: 'home' },
      { label: 'Communities', action: () => navigation.navigate('Crop Communities'), icon: 'people' },
      { label: 'My Crops Manager', action: () => navigation.navigate('Crops Manager'), icon: 'leaf' },
      { label: 'AgriTech Companies', action: () => navigation.navigate('AgriTech Companies'), icon: 'business' },
      { label: 'Insurance Agencies', action: () => navigation.navigate('Crop Insurance'), icon: 'shield-checkmark' },
      { label: 'Pest Control Guides', action: () => navigation.navigate('Pest Guides'), icon: 'bug' },
    ],
    'Livestock Farmer': [
      { label: 'Dashboard', action: () => navigation.navigate('Livestock FarmerHome'), icon: 'home' },
      { label: 'Communities', action: () => navigation.navigate('Livestock Communities'), icon: 'people' },
      { label: 'My Livestock Profiles', action: () => navigation.navigate('Livestock Profiles'), icon: 'sparkles' },
      { label: 'Veterinarians', action: () => navigation.navigate('Veterinarians'), icon: 'medkit' },
      { label: 'Insurance Agencies', action: () => navigation.navigate('Livestock Insurance'), icon: 'shield-checkmark' },
      { label: 'Livestock Care Guides', action: () => navigation.navigate('CareGuides'), icon: 'book' },
    ],
  };

  useEffect(() => {
    // Synchronize the profile with the selectedProfile passed from props
    setProfile(selectedProfile as 'Consumer' | 'Crop Farmer' | 'Livestock Farmer');
  }, [selectedProfile]); // Runs whenever selectedProfile changes

  const handleMenuItemPress = (item: { label: string; action: () => void; }) => {
    setActiveItem(item.label);
    item.action();
  };

  return (
    <View style={styles.drawerContent}>
      <UserProfile />
      <View style={styles.profileContainer}>
        <Text style={styles.drawerHeader}>Profile:</Text>
        <Picker
          selectedValue={profile}
          onValueChange={(value: 'Consumer' | 'Crop Farmer' | 'Livestock Farmer') => {
            setProfile(value);
            navigation.navigate(`${value}Home`);
          }}
          style={styles.profilePicker}
        >
          <Picker.Item label="Consumer" value="Consumer" />
          <Picker.Item label="Crop Farmer" value="Crop Farmer" />
          <Picker.Item label="Livestock Farmer" value="Livestock Farmer" />
        </Picker>
      </View>
      <View style={styles.menuItems}>
        {profileMenuItems[profile] &&
          profileMenuItems[profile].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleMenuItemPress(item)}
              style={[
                styles.menuItem,
                activeItem === item.label && styles.activeMenuItem, // Apply active styling
              ]}
            >
              <Ionicons name={item.icon} size={20} color={activeItem === item.label ? '#fff' : '#333'} />
              <Text style={[styles.menuItemText, activeItem === item.label && styles.activeMenuItemText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => {
          setActiveItem('Sell'); // Update the activeItem state
          navigation.navigate('Sell'); // Navigate to the Sell screen
        }}
        style={[
          styles.menuItem,
          activeItem === 'Sell' && styles.activeMenuItem, // Apply active styling for 'Sell'
        ]}
      >
        <Ionicons
          name="add-circle"
          size={20}
          color={activeItem === 'Sell' ? '#fff' : '#333'}
        />
        <Text style={[styles.menuItemText, activeItem === 'Sell' && styles.activeMenuItemText]}>Sell</Text>
      </TouchableOpacity>


      {/* <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={[styles.menuItem, activeItem === 'Messages' && styles.activeMenuItem]}>
        <Ionicons name="chatbubbles" size={20} color={activeItem === 'Messages' ? '#fff' : '#333'} />
        <Text style={[styles.menuItemText, activeItem === 'Messages' && styles.activeMenuItemText]}>Messages</Text>
      </TouchableOpacity> */}

      <TouchableOpacity 
      onPress={() => {
        setIsLoggingOut(true); // start loading
        setTimeout(() => {
          AsyncStorage.removeItem('token');
          setIsLoggingOut(false); // stop loading (optional, since navigating away)
          navigation.navigate('Auth');
        }, 1000);
      }} 
        style={[styles.menuItem, activeItem === 'Logout' && styles.activeMenuItem]}>
        <Ionicons name="log-out" size={20} color={activeItem === 'Logout' ? '#fff' : '#333'} />
        <Text style={[styles.menuItemText, activeItem === 'Logout' && styles.activeMenuItemText]}>Logout</Text>
      </TouchableOpacity>

        {isLoggingOut && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>Logging Out...</Text>
        </View>
      )}
    </View>

  );
};




const styles = StyleSheet.create({
  profileContainer: {
    marginTop: 30,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  drawerHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 'auto',
    color: '#333',
    alignSelf: 'center'
  },
  profilePicker: {
   backgroundColor: '#F1F8E9',
   width: '70%',
   margin: 'auto',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row', // Icons and text in a row
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 20,
  },
  activeMenuItem: {
    backgroundColor: '#4CAF50', // Green background for active item
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  activeMenuItemText: {
    color: '#fff', // White text for active item
  },
});

export default CustomDrawer;




// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

// const CustomDrawer = ({ navigation }) => {

//   const [selectedProfile, setSelectedProfile] = useState('Consumer');
//   const [activeItem, setActiveItem] = useState('Dashboard'); // Track active menu item

//   const profileMenuItems = {
//     Consumer: [
//       { label: 'Dashboard', action: () => navigation.navigate('ConsumerHome'), icon: 'home' },
//       { label: 'Cart', action: () => navigation.navigate('Cart'), icon: 'cart' },
//       { label: 'Orders', action: () => navigation.navigate('Orders'), icon: 'clipboard' },
//       { label: 'My Products', action: () => navigation.navigate('My Products'), icon: 'pricetag' },
//     ],
//     'Crop Farmer': [
//       { label: 'Dashboard', action: () => navigation.navigate('CropFarmerHome'), icon: 'home' },
//       { label: 'Communities', action: () => navigation.navigate('Crop Communities'), icon: 'people' },
//       { label: 'My Crops Manager', action: () => navigation.navigate('Crops Manager'), icon: 'leaf' },
//       { label: 'AgriTech Companies', action: () => navigation.navigate('AgriTech Companies'), icon: 'business' },
//       { label: 'Insurance Agencies', action: () => navigation.navigate('Crop Insurance'), icon: 'shield-checkmark' },
//       { label: 'Pest Control Guides', action: () => navigation.navigate('Pest Guides'), icon: 'bug' },
//     ],
//     'Livestock Farmer': [
//       { label: 'Dashboard', action: () => navigation.navigate('LivestockFarmerHome'), icon: 'home' },
//       { label: 'Communities', action: () => navigation.navigate('Livestock Communities'), icon: 'people' },
//       { label: 'My Livestock Profiles', action: () => navigation.navigate('Livestock Profiles'), icon: 'sparkles' },
//       { label: 'Veterinarians', action: () => navigation.navigate('Veterinarians'), icon: 'medkit' },
//       { label: 'Insurance Agencies', action: () => navigation.navigate('Livestock Insurance'), icon: 'shield-checkmark' },
//       { label: 'Livestock Care Guides', action: () => navigation.navigate('CareGuides'), icon: 'book' },
//     ],
//   };

//   const handleProfileChange = (value: string) => {
//     setSelectedProfile(value);
//     if (value === 'Consumer') {
//       navigation.navigate('ConsumerHome');
//     } else if (value === 'Crop Farmer') {
//       navigation.navigate('CropFarmerHome');
//     } else {
//       navigation.navigate('LivestockFarmerHome');
//     }
//     setActiveItem('Dashboard'); // Reset active item when switching profiles
//   };

//   const handleMenuItemPress = (item: any) => {
//     setActiveItem(item.label);
//     item.action();
//   };

//   return (
//     <View style={styles.drawerContent}>
//       <Text style={styles.drawerHeader}>Profile</Text>
//       <Picker selectedValue={selectedProfile} onValueChange={handleProfileChange}>
//         <Picker.Item label="Consumer" value="Consumer" />
//         <Picker.Item label="Crop Farmer" value="Crop Farmer" />
//         <Picker.Item label="Livestock Farmer" value="Livestock Farmer" />
//       </Picker>
//       <View style={styles.menuItems}>
//         {profileMenuItems[selectedProfile].map((item: any, index: number) => (
//           <TouchableOpacity
//             key={index}
//             onPress={() => handleMenuItemPress(item)}
//             style={[
//               styles.menuItem,
//               activeItem === item.label && styles.activeMenuItem, // Apply active styling
//             ]}
//           >
//             <Ionicons name={item.icon} size={20} color={activeItem === item.label ? '#fff' : '#333'} />
//             <Text style={[styles.menuItemText, activeItem === item.label && styles.activeMenuItemText]}>
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   drawerHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     margin: 20,
//     color: '#4CAF50',
//   },
//   drawerContent: {
//     flex: 1,
//     padding: 20,
//   },
//   menuItems: {
//     marginTop: 20,
//   },
//   menuItem: {
//     flexDirection: 'row', // Icons and text in a row
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 0.5,
//     borderColor: '#ccc',
//     marginBottom: 10,
//     borderRadius: 20,
//   },
//   activeMenuItem: {
//     backgroundColor: '#4CAF50', // Green background for active item
//   },
//   menuItemText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#000',
//   },
//   activeMenuItemText: {
//     color: '#fff', // White text for active item
//   },
// });

// export default CustomDrawer;

