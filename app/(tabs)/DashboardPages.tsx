import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomHeader from '@/components/subcomponents/CustomHeader';

import ConsumerHomeScreen from '@/components/consumers/Dashboard';
import CropFarmerHomeScreen from '@/components/cropfarmers/Dashboard';
import LivestockFarmerHomeScreen from '@/components/livestockfarmers/Dashboard';

import MyCartScreen from '@/components/consumers/Cart';
import OrdersScreen from '@/components/consumers/Orders';
import MyRecipesScreen from '@/components/consumers/Recipes';

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
import { ActivityIndicator, View } from 'react-native';

const Drawer = createDrawerNavigator();

const DashboardPages = () => {
  const [userProfile, setUserProfile] = useState('');
  const [initialRouteName, setInitialRouteName] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Retrieve profile type from AsyncStorage
    const fetchProfile = async () => {
      try {
        // First, check for the profile type selected in the CustomDrawer
        const selectedProfile = await AsyncStorage.getItem('currentProfileType');
        
        if (selectedProfile) {
          // console.log('Using selected profile from drawer:', selectedProfile);
          setUserProfile(selectedProfile);
          
          // Set initial route based on the selected profile type
          if (selectedProfile === 'Consumer') {
            setInitialRouteName('ConsumerHome');
          } else if (selectedProfile === 'Crop Farmer') {
            setInitialRouteName('Crop FarmerHome');
          } else if (selectedProfile === 'Livestock Farmer') {
            setInitialRouteName('Livestock FarmerHome');
          }
        } else {
          // If no selection found, fallback to the profile_type from login
          const backendProfile = await AsyncStorage.getItem('profile_type');
          if (backendProfile) {
            // console.log('Using backend profile:', backendProfile);
            setUserProfile(backendProfile);
            
            // Set initial route based on the backend profile type
            if (backendProfile === 'Consumer') {
              setInitialRouteName('ConsumerHome');
            } else if (backendProfile === 'Crop Farmer') {
              setInitialRouteName('Crop FarmerHome');
            } else if (backendProfile === 'Livestock Farmer') {
              setInitialRouteName('Livestock FarmerHome');
            }
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error fetching profile from AsyncStorage:", error);
        setIsInitialized(true);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Wait for initialization before rendering
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <Drawer.Navigator 
      initialRouteName={initialRouteName}
      drawerContent={(props) => <CustomDrawer {...props} selectedProfile={userProfile} />} 
      screenOptions={{
        headerTitle: ()=> <CustomHeader navigation={undefined}/>,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#F1F8E9',
        },
        headerLeftContainerStyle: {
          paddingLeft: 5,
        },
      }}
      >
        {/* Dashboard Screens */}
        <Drawer.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Drawer.Screen name="Crop FarmerHome" component={CropFarmerHomeScreen} />
        <Drawer.Screen name="Livestock FarmerHome" component={LivestockFarmerHomeScreen} />
        {/* Consumers */}
        <Drawer.Screen name="Cart" component={MyCartScreen} />
        <Drawer.Screen name="Orders" component={OrdersScreen} />
        <Drawer.Screen name="Recipes" component={MyRecipesScreen} />
        
        {/* Crop Farmers */}
        <Drawer.Screen name="cfCart" component={MyCartScreen} />
        <Drawer.Screen name="Crop Communities" component={CropCommunityScreen} />
        <Drawer.Screen name="Crops Manager" component={CropsManagerScreen} />
        <Drawer.Screen name="AgriTech Companies" component={AgenciesScreen} />
        <Drawer.Screen name="Crop Insurance" component={CropInsuranceScreen} />
        <Drawer.Screen name="Pest Guides" component={PestGuidesScreen} />
        {/* Livestock Farmers */}
        <Drawer.Screen name="lfCart" component={MyCartScreen} />
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