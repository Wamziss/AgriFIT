import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const API_BASE_URL = 'http://192.168.100.51/AgriFIT/crop_profile.php';

const CropForm = ({
  visible,
  crop: initialCrop,
  editMode,
  resetForm,
  fetchCrops,
}) => {
  const [crop, setCrop] = useState(initialCrop);

  // Update local state when initial crop changes
  useEffect(() => {
    setCrop(initialCrop);
  }, [initialCrop]);

  const handleChange = (field, value) => {
    setCrop((prev) => ({ ...prev, [field]: value }));
  };

  const saveCrop = async () => {
    const owner = await AsyncStorage.getItem('sellerId');

    if (!owner) {
      Alert.alert('Error', 'Owner ID not found in storage');
      return;
    }
    
    const completeCrop = {
      ...crop,
      owner_id: owner,
    };

    // Check if all required fields are filled
    if (!completeCrop.crop_name || !completeCrop.planting_date) {
      Alert.alert('Validation Error', 'Crop Name and Planting Date are required');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(completeCrop).forEach((key) =>
        formData.append(key, completeCrop[key] || '')
      );

      if (editMode) {
        // Update existing crop
        const response = await axios.post(
          `${API_BASE_URL}?crop_id=${crop.crop_id}`, 
          formData, 
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (response.data.status === 'success') {
          Alert.alert('Success', 'Crop profile updated!');
          fetchCrops();
          resetForm();
        } else {
          Alert.alert('Error', response.data.message || 'Failed to update crop profile');
        }
      } else {
        // Create new crop
        const response = await axios.post(API_BASE_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.status === 'success') {
          Alert.alert('Success', 'Crop profile saved successfully!');
          fetchCrops();
          resetForm();
        } else {
          Alert.alert('Error', response.data.message || 'Failed to save crop profile');
        }
      }
    } catch (error) {
      console.error('Save Crop Error:', error);
      Alert.alert('Error', 'Failed to save crop profile');
    }
  };  

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
          <Ionicons name="close-circle" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>
          {editMode ? 'Edit Crop' : 'Add New Crop'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Crop Name"
          value={crop.crop_name}
          onChangeText={(text) => handleChange('crop_name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Planting Date"
          value={crop.planting_date}
          onChangeText={(text) => handleChange('planting_date', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Maturity Status"
          value={crop.maturity_status}
          onChangeText={(text) => handleChange('maturity_status', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Details"
          value={crop.details}
          onChangeText={(text) => handleChange('details', text)}
        />
        <TouchableOpacity style={styles.addButtonModal} onPress={saveCrop}>
          <Text style={styles.addButtonText}>
            {editMode ? 'Update Crop' : 'Add Crop'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonModal: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CropForm;