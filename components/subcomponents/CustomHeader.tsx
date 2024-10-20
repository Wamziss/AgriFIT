import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

const colors = {
    primary: '#4CAF50',
    black: '#000000'
};

const CustomHeader = ({ navigation }: { navigation: any }) => {
  return (
    <TouchableOpacity style={styles.logoContainer} onPress={() => navigation.navigate('Home')}>
      <FontAwesome name="leaf" size={48} color={colors.primary} />
      <Text style={styles.logoText}>
        Agri<Text style={{ color: colors.black }}>FIT</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
      },
      logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary,
        marginLeft: 5,
      },
});

export default CustomHeader;
