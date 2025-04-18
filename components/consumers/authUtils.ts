// authUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://agrifit-backend-production.up.railway.app';

// Save user data after login
export const saveUserData = async (userData: any) => {
  try {
    await AsyncStorage.setItem('userToken', userData.token);
    await AsyncStorage.setItem('userId', userData.user_id.toString());
    await AsyncStorage.setItem('userProfile', JSON.stringify({
      id: userData.user_id,
      profileType: userData.profile_type,
      name: userData.user_name,
      email: userData.user_email,
      phone: userData.user_phone
    }));
    
    // Set default Authorization header for all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get current user token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get user profile data
export const getUserProfile = async () => {
  try {
    const profileData = await AsyncStorage.getItem('updates');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Clear all user data on logout
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userProfile');
    
    // Remove default Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

// Check if user is logged in
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

// Setup axios interceptor to handle token
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};