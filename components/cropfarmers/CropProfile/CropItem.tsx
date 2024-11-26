import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const CropItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.cropCard}>
    <View style={styles.cropInfo}>
      <Text style={styles.cropName}>{item.crop_name}</Text>
      <Text style={styles.cropDetail}>Planting Date: {item.planting_date}</Text>
      <Text style={styles.cropDetail}>Maturity Status: {item.maturity_status}</Text>
      <Text style={styles.cropDetail}>Details: {item.details}</Text>
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
  cropCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropInfo: {
    flex: 1,
    marginRight: 10,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  cropDetail: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 3,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: 8,
    borderRadius: 5,
  },
});

export default CropItem;