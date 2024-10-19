import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react';

const Home = () => {
  return (
    <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
      <Text>Heyyy homeee</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        // marginTop: StatusBar.currentHeight,
    }
})

export default Home