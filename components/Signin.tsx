import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CustomHeader from './subcomponents/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast, ToastModal, ToastType } from './subcomponents/Toast'; // Assuming ToastComponent is in the same directory

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
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Use the toast hook
  const { showToast, message, type, isVisible } = useToast();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignInSuccess = (profile: string) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard', params: { screen: `${profile}Home` } }],
    });
  };

  const handleSignIn = async () => {
    // Validate input
    if (!emailOrPhoneNumber || !password) {
      showToast('Please enter both email/phone and password', ToastType.ERROR);
      return;
    }

    try {
      // const response = await fetch('http://192.168.23.67/AgriFIT/login.php', {
      const response = await fetch('http://agrifit.42web.io/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhoneNumber, password })
      });

      if (!response.ok) {
        console.log("Network response was not ok:", response);
        showToast('Please check your network connection.', ToastType.ERROR);
        return;
      }

      const responseText = await response.text();
      console.log("Response text:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        showToast('An error occurred with the response format. Please contact support.', ToastType.ERROR);
        return;
      }

      if (result.status === 'success') {
        await AsyncStorage.setItem('token', result.token);
        await AsyncStorage.setItem('profile_type', result.profile_type);
        console.log('profile_type:', result.profile_type);
        await AsyncStorage.setItem('userName', result.user_name);
        await AsyncStorage.setItem('userEmail', result.user_email);
        await AsyncStorage.setItem('userPhone', result.user_phone);
        const userid = String(result.user_id);
        await AsyncStorage.setItem('sellerId', userid);

        // Show success toast before navigating
        showToast('Sign in successful!', ToastType.SUCCESS);
        
        // Use setTimeout to allow toast to be visible briefly before navigation
        setTimeout(() => {
          handleSignInSuccess(result.profile_type);
        }, 1000);
        
      } else {
        showToast(result.message || 'Sign in failed. Please try again.', ToastType.ERROR);
      }
    } catch (error) {
      console.error("Error in handleSignIn:", error);
      showToast('An error occurred. Please try again.', ToastType.ERROR);
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
              value={emailOrPhoneNumber}
              onChangeText={setEmailOrPhoneNumber}
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
                value={password}
                onChangeText={setPassword}
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

        {/* Add the Toast Modal */}
        <ToastModal 
          message={message}
          type={type}
          isVisible={isVisible}
        />
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


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import { Ionicons, FontAwesome } from '@expo/vector-icons';
// import CustomHeader from './subcomponents/CustomHeader';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const colors = {
//   primary: '#4CAF50',
//   secondary: '#8BC34A',
//   text: '#333333',
//   background: '#F1F8E9',
//   white: '#FFFFFF',
//   error: '#FF6B6B',
//   black: '#000000'
// };

// const SignInScreen = ({ navigation }: { navigation: any }) => {
//   const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState(''); // State for email or phone number
//   const [password, setPassword] = useState(''); // State for password
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleSignInSuccess = (profile: string) => {
//     // Reset the navigation stack and navigate to the correct profile home screen
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Dashboard', params: { screen: `${profile}Home` } }],
//     });
//   };


//   const handleSignIn = async () => {
//     try {
//         const response = await fetch('http://agrifit.42web.io/login.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email: emailOrPhoneNumber, password })
//         });

//         if (!response.ok) {
//             console.error("Network response was not ok:", response.status, response.statusText);
//             alert("Unable to connect to server. Please check your network connection.");
//             return;
//         }

//         // Log the response text for debugging
//         const responseText = await response.text();
//         console.log("Response text:", responseText);

//         // Try parsing the response as JSON
//         let result;
//         try {
//             result = JSON.parse(responseText);  // Manually parse the JSON to catch errors
//         } catch (jsonError) {
//             console.error("Error parsing JSON:", jsonError);
//             alert("An error occurred with the response format. Please contact support.");
//             return;
//         }

//         if (result.status === 'success') {
//             await AsyncStorage.setItem('token', result.token);
//             await AsyncStorage.setItem('profile_type', result.profile_type);
//             await AsyncStorage.setItem('userName', result.user_name); // Save name
//             await AsyncStorage.setItem('userEmail', result.user_email); // Save email
//             await AsyncStorage.setItem('userPhone', result.user_phone);
//             const userid = String(result.user_id);
//             await AsyncStorage.setItem('sellerId', userid);

//             handleSignInSuccess(result.profile_type);
            
//         } else {
//             console.warn("Login failed:", result.message);
//             alert(result.message || "Login failed. Please try again.");
//         }
//     } catch (error) {
//         console.error("Error in handleSignIn:", error);
//         alert('An error occurred. Please try again.');
//     }
// };



//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <CustomHeader navigation={navigation} />

//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email or Phone Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholderTextColor="#888"
//               value={emailOrPhoneNumber} // Set value from state
//               onChangeText={setEmailOrPhoneNumber} // Update state on change
//               autoComplete="email"
//               keyboardType="email-address" 
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Password</Text>
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 style={styles.passwordInput}
//                 secureTextEntry={!showPassword}
//                 value={password} // Set value from state
//                 onChangeText={setPassword} // Update state on change
//                 autoComplete='password'
//               />
//               <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
//                 <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.primary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleSignIn}>
//             <Text style={styles.buttonText}>Sign In</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
//             <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//             <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

