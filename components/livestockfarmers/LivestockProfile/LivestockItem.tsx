import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const colors = {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    text: '#333333',
    background: '#F1F8E9',
    white: '#FFFFFF',
    error: '#FF6B6B',
    black: '#000000',
    gray: '#E0E0E0',
  };

const LivestockItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.livestockCard}>
    <Image
    //   source={{ uri: item.photo || '/api/placeholder/150/150' }}
      source={item.photo ? { uri: `https://agrifit-backend-production.up.railway.app/${item.photo}` } : undefined}
      style={styles.livestockImage}
    />
    <View style={styles.livestockInfo}>
      <Text style={styles.livestockName}>{item.animal_name}</Text>
      <Text style={styles.livestockDetail}>Breed: {item.breed}</Text>
      <Text style={styles.livestockDetail}>Age: {item.age}</Text>
      <Text style={styles.livestockDetail}>Weight: {item.weight}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create" size={20} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
    livestockCard: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    livestockImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginRight: 15,
    },
    livestockInfo: {
      flex: 1,
    },
    livestockName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    livestockDetail: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 3,
    },
    actionButtons: {
      flexDirection: 'column',
    },
    editButton: {
      backgroundColor: colors.primary,
      padding: 5,
      borderRadius: 5,
      marginBottom: 5,
    },
    deleteButton: {
      backgroundColor: colors.error,
      padding: 5,
      borderRadius: 5,
    },
});

export default LivestockItem;
