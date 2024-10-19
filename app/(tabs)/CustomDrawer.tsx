import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const CustomDrawer = ({ navigation }) => {

  const [selectedProfile, setSelectedProfile] = useState('Consumer');
  const [activeItem, setActiveItem] = useState('Dashboard'); // Track active menu item

  const profileMenuItems = {
    Consumer: [
      { label: 'Dashboard', action: () => navigation.navigate('ConsumerHome'), icon: 'home' },
      { label: 'Cart', action: () => navigation.navigate('Cart'), icon: 'cart' },
      { label: 'Orders', action: () => navigation.navigate('Orders'), icon: 'clipboard' },
      { label: 'My Products', action: () => navigation.navigate('My Products'), icon: 'pricetag' },
    ],
    'Crop Farmer': [
      { label: 'Dashboard', action: () => navigation.navigate('CropFarmerHome'), icon: 'home' },
      { label: 'Communities', action: () => navigation.navigate('Crop Communities'), icon: 'people' },
      { label: 'My Crops Manager', action: () => navigation.navigate('Crops Manager'), icon: 'leaf' },
      { label: 'AgriTech Companies', action: () => navigation.navigate('AgriTech Companies'), icon: 'business' },
      { label: 'Insurance Agencies', action: () => navigation.navigate('Crop Insurance'), icon: 'shield-checkmark' },
      { label: 'Pest Control Guides', action: () => navigation.navigate('Pest Guides'), icon: 'bug' },
    ],
    'Livestock Farmer': [
      { label: 'Dashboard', action: () => navigation.navigate('LivestockFarmerHome'), icon: 'home' },
      { label: 'Communities', action: () => navigation.navigate('Livestock Communities'), icon: 'people' },
      { label: 'My Livestock Profiles', action: () => navigation.navigate('Livestock Profiles'), icon: 'sparkles' },
      { label: 'Veterinarians', action: () => navigation.navigate('Veterinarians'), icon: 'medkit' },
      { label: 'Insurance Agencies', action: () => navigation.navigate('Livestock Insurance'), icon: 'shield-checkmark' },
      { label: 'Livestock Care Guides', action: () => navigation.navigate('CareGuides'), icon: 'book' },
    ],
  };

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value);
    if (value === 'Consumer') {
      navigation.navigate('ConsumerHome');
    } else if (value === 'Crop Farmer') {
      navigation.navigate('CropFarmerHome');
    } else {
      navigation.navigate('LivestockFarmerHome');
    }
    setActiveItem('Dashboard'); // Reset active item when switching profiles
  };

  const handleMenuItemPress = (item: any) => {
    setActiveItem(item.label);
    item.action();
  };

  return (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerHeader}>Profile</Text>
      <Picker selectedValue={selectedProfile} onValueChange={handleProfileChange}>
        <Picker.Item label="Consumer" value="Consumer" />
        <Picker.Item label="Crop Farmer" value="Crop Farmer" />
        <Picker.Item label="Livestock Farmer" value="Livestock Farmer" />
      </Picker>
      <View style={styles.menuItems}>
        {profileMenuItems[selectedProfile].map((item: any, index: number) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20,
    color: '#4CAF50',
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




// import { useState} from 'react'
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const CustomDrawer = ({ navigation }) => {

//     const [selectedProfile, setSelectedProfile] = useState('Consumer');

//     const profileMenuItems = {
//       Consumer: [
//         { label: 'Dashboard', action: () => navigation.navigate('ConsumerHome') },
//         { label: 'Cart', action: () => navigation.navigate('Cart') },
//         { label: 'Orders', action: () => navigation.navigate('Orders') },
//         { label: 'Sell', action: () => navigation.navigate('Sell') },
//       ],
//       'Crop Farmer': [
//         { label: 'Dashboard', action: () => navigation.navigate('CropFarmerHome') },
//         { label: 'Communities', action: () => navigation.navigate('Crop Communities') },
//         { label: 'My Crops Manager', action: () => navigation.navigate('Crops Manager') },
//         { label: 'AgriTech Companies', action: () => navigation.navigate('AgriTech Companies') },
//         { label: 'Insurance Agencies', action: () => navigation.navigate('Crop Insurance') },
//         { label: 'Pest Control Guides', action: () => navigation.navigate('Pest Guides') },
//       ],
//       'Livestock Farmer': [
//         { label: 'Dashboard', action: () => navigation.navigate('LivestockFarmerHome') },
//         { label: 'Communities', action: () => navigation.navigate('Livestock Communities') },
//         { label: 'My Livestock Profiles', action: () => navigation.navigate('Livestock Profiles') },
//         { label: 'Veterinarians', action: () => navigation.navigate('Veterinarians') },
//         { label: 'Insurance Agencies', action: () => navigation.navigate('Livestock Insurance') },
//         { label: 'Livestock Care Guides', action: () => navigation.navigate('CareGuides') },
//       ],
//     };
  
//     const handleProfileChange = (value: string) => {
//       setSelectedProfile(value);
//       if (value === 'Consumer') {
//         navigation.navigate('ConsumerHome');
//       } else if (value === 'Crop Farmer') {
//         navigation.navigate('CropFarmerHome');
//       } else {
//         navigation.navigate('LivestockFarmerHome');
//       }
//     };

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
//           <TouchableOpacity key={index} onPress={item.action} style={styles.menuItem}>
//             <Text>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   drawerHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     margin: 20,
//     color: '#008000',
//   },
//   drawerContent: {
//     flex: 1,
//     padding: 20,
//   },
//   menuItems: {
//     marginTop: 20,
//   },
//   menuItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1, 
//     borderColor: '#ccc',
//     marginBottom: 10
//   },
// });

// export default CustomDrawer