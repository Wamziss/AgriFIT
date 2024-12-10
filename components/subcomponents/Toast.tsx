import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Toast Types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Toast Configuration
const toastConfig = {
  [ToastType.SUCCESS]: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  [ToastType.ERROR]: {
    backgroundColor: '#F44336',
    color: 'white'
  },
  [ToastType.WARNING]: {
    backgroundColor: '#FF9800',
    color: 'white'
  },
  [ToastType.INFO]: {
    backgroundColor: '#2196F3',
    color: 'white'
  }
};

// Toast Hook
export const useToast = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>(ToastType.SUCCESS);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (msg: string, toastType: ToastType = ToastType.SUCCESS, duration: number = 3000) => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  return { showToast, message, type, isVisible };
};

// Toast Component
export const ToastModal = ({ 
  message, 
  type = ToastType.SUCCESS, 
  isVisible 
}: { 
  message: string, 
  type?: ToastType, 
  isVisible: boolean 
}) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.toastContainer, 
        { 
          opacity: fadeAnim,
          backgroundColor: toastConfig[type].backgroundColor 
        }
      ]}
    >
      <Text style={[styles.toastText, { color: toastConfig[type].color }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000
  },
  toastText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  }
});