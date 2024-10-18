// import React = require('react')
import React = require('react');
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomHeader from '@/components/subcomponents/CustomHeader';

import ConsumerHomeScreen from '@/components/consumers/Dashboard';
import CropFarmerHomeScreen from '@/components/cropfarmers/Dashboard';
import LivestockFarmerHomeScreen from '@/components/livestockfarmers/Dashboard';

import MyCartScreen from '@/components/consumers/Cart';
import OrdersScreen from '@/components/consumers/Orders';
import SellScreen from '@/components/consumers/Sell';

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
import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

const DashboardPages = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{
        headerTitle: ()=> <CustomHeader/>,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerLeftContainerStyle: {
          paddingLeft: 5,
        },
      }}>
        {/* Dashboard Screens */}
        <Drawer.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Drawer.Screen name="CropFarmerHome" component={CropFarmerHomeScreen} />
        <Drawer.Screen name="LivestockFarmerHome" component={LivestockFarmerHomeScreen} />
        {/* Consumers */}
        <Drawer.Screen name="Cart" component={MyCartScreen} />
        <Drawer.Screen name="Orders" component={OrdersScreen} />
        <Drawer.Screen name="Sell" component={SellScreen} />
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
      </Drawer.Navigator>
  )
}

export default DashboardPages