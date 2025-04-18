// import React from 'react';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomHeader from '@/components/subcomponents/CustomHeader';

import ConsumerHomeScreen from '@/components/consumers/Dashboard';
import CropFarmerHomeScreen from '@/components/cropfarmers/Dashboard';
import LivestockFarmerHomeScreen from '@/components/livestockfarmers/Dashboard';

import MyCartScreen from '@/components/consumers/Cart';
import OrdersScreen from '@/components/consumers/Orders';
import MyProductsScreen from '@/components/consumers/MyProducts';

import CropCommunityScreen from '@/components/cropfarmers/Communities';
import CropsManagerScreen from '@/components/cropfarmers/CropsManager';
import AgenciesScreen from '@/components/cropfarmers/Agencies';
import CropInsuranceScreen from '@/components/cropfarmers/Insurance';
import PestGuidesScreen from '@/components/cropfarmers/PestGuides';

import LivestockCommunityScreen from '@/components/livestockfarmers/Communities';
import LivestockProfilesScreen from '@/components/livestockfarmers/LivestockProfiles';
import VeterinariansScreen from '@/components/livestockfarmers/Veterinarians';
import LivestockInsuranceScreen from '@/components/livestockfarmers/Insurance';
import CareGuidesScreen from '@/components/livestockfarmers/CareGuides';

import MessagesScreen from '@/components/Messages';
import SellProductsScreen from '@/components/Sell';

import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

const DashboardPages = () => {
  const [userProfile, setUserProfile] = useState('');

  useEffect(() => {
    // Retrieve profile type from AsyncStorage
    const fetchProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('profile_type');
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching profile from AsyncStorage:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} selectedProfile={userProfile} />} screenOptions={{
        headerTitle: ()=> <CustomHeader navigation={undefined}/>,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#F1F8E9',
        },
        headerLeftContainerStyle: {
          paddingLeft: 5,
        },
      }}>
        {/* Dashboard Screens */}
        <Drawer.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Drawer.Screen name="Crop FarmerHome" component={CropFarmerHomeScreen} />
        <Drawer.Screen name="Livestock FarmerHome" component={LivestockFarmerHomeScreen} />
        {/* Consumers */}
        <Drawer.Screen name="Cart" component={MyCartScreen} />
        <Drawer.Screen name="Orders" component={OrdersScreen} />
        <Drawer.Screen name="My Products" component={MyProductsScreen} />
        
        {/* Crop Farmers */}
        <Drawer.Screen name="Crop Communities" component={CropCommunityScreen} />
        <Drawer.Screen name="Crops Manager" component={CropsManagerScreen} />
        <Drawer.Screen name="AgriTech Companies" component={AgenciesScreen} />
        <Drawer.Screen name="Crop Insurance" component={CropInsuranceScreen} />
        <Drawer.Screen name="Pest Guides" component={PestGuidesScreen} />
        {/* Livestock Farmers */}
        <Drawer.Screen name="Livestock Communities" component={LivestockCommunityScreen} />
        <Drawer.Screen name="Livestock Profiles" component={LivestockProfilesScreen} />
        <Drawer.Screen name="Veterinarians" component={VeterinariansScreen} />
        <Drawer.Screen name="Livestock Insurance" component={LivestockInsuranceScreen} />
        <Drawer.Screen name="CareGuides" component={CareGuidesScreen} />


        <Drawer.Screen name="Sell" component={SellProductsScreen} />
        <Drawer.Screen name="Messages" component={MessagesScreen} />
      </Drawer.Navigator>
  )
}

export default DashboardPages;