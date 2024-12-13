import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from './subcomponents/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast, ToastModal, ToastType } from './subcomponents/Toast';

// Color scheme (consistent with the landing page)
const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
};

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    defaultProfile: 'Consumer',
  });

  const { showToast, message, type, isVisible } = useToast();

  const validateInputs = () => {
    const { fullName, email, phoneNumber, password, confirmPassword } = formData;

    if (!fullName) {
      showToast('Full Name is required.', ToastType.ERROR);
      return false;
    }

    if (!email) {
      showToast('Email is required.', ToastType.ERROR);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', ToastType.ERROR);
      return false;
    }

    if (!phoneNumber) {
      showToast('Phone Number is required.', ToastType.ERROR);
      return false;
    }

    if (!password) {
      showToast('Password is required.', ToastType.ERROR);
      return false;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', ToastType.ERROR);
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return; // Stop execution if validation fails
    }
  
    const signUpData = {
      full_name: formData.fullName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      password: formData.password,
      profile_type: formData.defaultProfile,
      profile_pic: '',
    };
  
    try {
      const response = await fetch('http://192.168.100.51/AgriFIT/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });
  
      if (!response.ok) {
        showToast('Please check your network connection.', ToastType.ERROR);
        return;
      }
  
      const result = await response.json();
      console.log('Sign up result:', result); // Log the result for debugging
  
      if (result.status === 'success') {
        // Use default values if properties are undefined
        const fullName = result.full_name || '';
        const email = result.email || '';
        const phone = result.phone || '';
        const profilePicture = result.profilePicture || 'default-profile-picture-url';
  
        await AsyncStorage.setItem('userName', fullName);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPhone', phone);
        await AsyncStorage.setItem('userProfilePic', profilePicture);
  
        showToast('Sign up successful!', ToastType.SUCCESS);
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 1500);
      } else {
        showToast(result.message || 'Sign up failed. Please try again.', ToastType.ERROR);
      }
    } catch (error) {
      console.error('Error in Sign up:', error);
      showToast('An error occurred. Please try again.', ToastType.ERROR);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader navigation={navigation} />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Profile Type</Text>
          <RNPickerSelect
            onValueChange={(value) =>
              setFormData({ ...formData, defaultProfile: value })
            }
            items={[
              { label: 'Consumer', value: 'Consumer' },
              { label: 'Crop Farmer', value: 'Crop Farmer' },
              { label: 'Livestock Farmer', value: 'Livestock Farmer' },
            ]}
            style={pickerSelectStyles}
            value={formData.defaultProfile}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signinText}>Already have an account? Sign In</Text>
        </TouchableOpacity>

        <ToastModal message={message} type={type} isVisible={isVisible} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signinText: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 20,
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.white,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    color: colors.text,
    paddingRight: 30,
    backgroundColor: colors.white,
  },
});
