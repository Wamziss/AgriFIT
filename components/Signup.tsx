import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from './subcomponents/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color scheme (consistent with the landing page)
const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000'
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

  const handleSignUp = async () => {

    const signUpData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        profile_type: formData.defaultProfile,
        profile_pic: ''
    };

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    

    try {
      const response = await fetch('http://192.168.100.51/AgriFIT/register.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(signUpData),
      });
  
      console.log('Response:', response); // Log the response
  
      if (!response.ok) {
          throw new Error('Network response was not ok'); // Throw an error if the response is not okay
      }
  
      const result = await response.json();
      if (result.status === 'success') {
          navigation.navigate('Dashboard');
          await AsyncStorage.setItem('userName', result.name);
          await AsyncStorage.setItem('userEmail', result.email);
          await AsyncStorage.setItem('userPhone', result.phone);
          await AsyncStorage.setItem('userProfilePic', result.profilePicture || 'default-profile-picture-url'); // You can set a default image URL or store the actual profile picture URL
    
          alert('Registration successful!');
      } else {
          alert(result.message);
      }
  } catch (error) {
      console.error('Fetch error:', error); // Log the error to the console
      alert('An error occurred. Please try again.');
  }
  
};


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader navigation={navigation}/>

        {/* <Text style={styles.title}>Sign Up</Text> */}

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
            onValueChange={(value) => setFormData({ ...formData, defaultProfile: value })}
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
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 5,
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
    shadowColor: "#000",
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
