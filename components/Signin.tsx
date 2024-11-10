import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CustomHeader from './subcomponents/CustomHeader';

// Color scheme (consistent with the landing page and sign up page)
const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000'
};

const SignInScreen = ({ navigation }: { navigation: any }) => {
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState(''); // State for email or phone number
  const [password, setPassword] = useState(''); // State for password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = async () => {
    const formData = {
        email: emailOrPhoneNumber, // Use the correct field name as needed by your backend
        password: password
    };

    try {
        // const response = await fetch('http://192.168.100.51/AgriFIT/login.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // });

        // const result = await response.json();
        // console.log('Response:', result);
        // if (result.status === 'success') {
        //     // Navigate to dashboard after successful login
        //     alert('Login successful');
        //     navigation.navigate('Dashboard');
        // } else {
        //     alert(result.message);
        // }
        navigation.navigate('Dashboard');
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
};



  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader navigation={navigation} />

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#888"
              value={emailOrPhoneNumber} // Set value from state
              onChangeText={setEmailOrPhoneNumber} // Update state on change
              autoComplete="email"
              keyboardType="email-address" 
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                value={password} // Set value from state
                onChangeText={setPassword} // Update state on change
                autoComplete='password'
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
  form: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: colors.black,
    paddingVertical: 15,
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
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 16,
  },
  signUpLink: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SignInScreen;
