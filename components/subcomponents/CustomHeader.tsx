import { View, Text, StyleSheet } from 'react-native'
import React = require('react');
import { FontAwesome } from '@expo/vector-icons';

const colors = {
    primary: '#4CAF50',
    black: '#000000'
  };

const CustomHeader = () => {
  return (
  <View style={styles.logoContainer} >
    <FontAwesome name="leaf" size={48} color={colors.primary} />
    <Text style={styles.logoText}>Agri<Text style={{color: colors.black}}>FIT</Text></Text>
  </View>
  )
}

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
})

export default CustomHeader