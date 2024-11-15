import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Color scheme
const colors = {
  primary: '#4CAF50',  // A fresh green color
  secondary: '#8BC34A', // A lighter green for accents
  text: '#333333',     // Dark gray for text
  background: '#F1F8E9', // Very light green background
  white: '#FFFFFF',
  black: '#000000'
};

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
    <ImageBackground 
      source={{ uri: 'https://example.com/farm-background.jpg' }} // Replace with your image URL
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.overlay}>
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

          <TouchableOpacity style={styles.partnerButton}>
            <Text style={styles.partnerButtonText}>
              Partner with us as an  <Text style={{textTransform: 'uppercase', color: colors.primary}}>Agrobusiness/Insurance Agency</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            {['google', 'facebook', 'envelope'].map((platform, index) => (
              <TouchableOpacity 
                key={platform} 
                // style={styles.socialButton}
                style={platform === 'envelope'? styles.emailButton : styles.socialButton}
                onPress={() => platform === 'envelope' ? navigation.navigate('SignIn') : null}
              >
                <FontAwesome name={platform} size={24} color={platform === 'envelope'? colors.white : colors.black} />
                <Text style={platform === 'envelope'? styles.emailText: styles.socialText}>
                  Sign In with {platform === 'envelope' ? 'Email' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
    flex: 1,
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
    marginVertical: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
    height: 100,
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
  partnerButton: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 2,
    marginVertical: 10,
    alignItems: 'center',
    borderColor: colors.black,
    shadowColor: "#000",
    elevation: 0.1,
  },
  partnerButtonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialContainer: {
    marginVertical: 30,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderColor: colors.text,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: .1,
  },
  emailButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  socialText: {
    color: '#333',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  emailText: {
    color: colors.white,
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: '600',
  },
});