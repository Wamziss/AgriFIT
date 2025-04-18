import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Color scheme
const colors = {
  primary: '#4CAF50', 
  secondary: '#8BC34A', 
  text: '#333333',    
  background: '#F1F8E9', 
  white: '#FFFFFF',
  black: '#000000',
  accent: '#2E7D32'  
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    "Easily find farmers close to you",
    "Join farmer communities to share insights",
    "Get Connected to Agrobusiness and insurance agencies"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient 
      colors={[colors.background, colors.white]} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <FontAwesome name="leaf" size={48} color={colors.primary} />
          <Text style={styles.logoText}>Agri<Text style={{color: colors.black}}>FIT</Text></Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Farming made easier. Register as a Consumer, Crop, or Livestock Farmer
          </Text>
        </View>

        <View style={styles.slideshowContainer}>
          <Text style={styles.slideText}>{slides[slideIndex]}</Text>
          <View style={styles.dotsContainer}>
            {slides.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: slideIndex === idx ? colors.primary : colors.secondary },
                ]}
              />
            ))}
          </View>
        </View>

        
        <TouchableOpacity 
          style={styles.partnerButton} 
          onPress={() => navigation.navigate('Agencies' as never)}
        >
          <Text style={styles.partnerButtonText}>
            Partner with us as an  <Text style={{textTransform: 'uppercase', color: colors.primary}}>Agrobusiness/Insurance Agency</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainActionButton} 
          onPress={() => navigation.navigate('SignIn' as never)}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.buttonGradient}
          >
            <FontAwesome name="sign-in" size={24} color={colors.white} />
            <Text style={styles.mainActionButtonText}>Sign In with Email</Text>
          </LinearGradient>
        </TouchableOpacity>


        <TouchableOpacity 
          onPress={() => navigation.navigate('SignUp' as never)}
          style={styles.signupContainer}
        >
          <Text style={[styles.signupText, {color: '#000'}]}>Don't have an account?<Text style={styles.signupText}> Sign Up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 5,
  },
  welcomeContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
  slideshowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    // backgroundColor: 'rgba(255,255,255,1)',
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 150,
  },
  slideText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  mainActionButton: {
    marginVertical: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  mainActionButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  partnerButton: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 2,
    marginVertical: 15,
    alignItems: 'center',
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});