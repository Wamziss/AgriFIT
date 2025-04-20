import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast, ToastModal, ToastType } from '../subcomponents/Toast';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'https://agrifit-backend-production.up.railway.app/livestock_profile.php';

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
};

type Livestock = {
  animal_id?: string;
  owner_id?: string;
  animal_name: string;
  breed: string;
  age: string;
  weight: string;
  births: string;
  photo?: string;
};

const LivestockProfiles = () => {
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState<Livestock>({
    animal_name: '',
    breed: '',
    age: '',
    weight: '',
    births: '',
  });
  const [image, setImage] = useState<any>(null);
  const modalKey = modalVisible ? 'modal-open' : 'modal-closed';
  
  // Get toast functionality from the hook
  const { showToast, message, type, isVisible } = useToast();

  // Fetch livestock when component mounts
  useEffect(() => {
    fetchLivestock();
  }, []);

  // Fetch livestock from backend
  const fetchLivestock = async () => {
    try {
      const response = await axios.get(API_URL);
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock:', error);
      showToast('Failed to fetch livestock profiles', ToastType.ERROR);
    }
  };

  // Pick image from device
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showToast('Permission to access media library is required!', ToastType.ERROR);
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picking error:', error);
      showToast('Failed to pick image', ToastType.ERROR);
    }
  };

  // Handle form submission (add/update livestock)
  const handleSubmit = async () => {
    if (!currentLivestock.animal_name || !currentLivestock.breed || !currentLivestock.age) {
      showToast('Please fill in required fields', ToastType.ERROR);
      return;
    }

    const owner = await AsyncStorage.getItem('sellerId');

    if (!owner) {
      showToast('User information not found', ToastType.ERROR);
      return;
    }

    try {
      // Create form data for multipart submission (for file upload)
      const formData = new FormData();
      
      // Add all livestock data
      formData.append('owner_id', owner);
      formData.append('animal_name', currentLivestock.animal_name);
      formData.append('breed', currentLivestock.breed);
      formData.append('age', currentLivestock.age);
      formData.append('weight', currentLivestock.weight || '0');
      formData.append('births', currentLivestock.births || '0');
      
      // If editing, include existing photo if no new image is selected
      if (currentLivestock.animal_id) {
        formData.append('animal_id', currentLivestock.animal_id);
        
        if (currentLivestock.photo && !image) {
          formData.append('existing_image', currentLivestock.photo);
        }
      }
      
      // Add image if available
      if (image && image.uri) {
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: image.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        } as any);
      }

      let response;
      
      if (currentLivestock.animal_id) {
        // Update existing livestock
        response = await axios.post(`${API_URL}?animal_id=${currentLivestock.animal_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        showToast('Livestock updated successfully', ToastType.SUCCESS);
      } else {
        // Add new livestock
        response = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        showToast('Livestock added successfully', ToastType.SUCCESS);
      }
      
      // Refresh livestock list
      fetchLivestock();
      resetForm();
    } catch (error) {
      console.error('Error saving livestock:', error);
      showToast('Failed to save livestock data', ToastType.ERROR);
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setCurrentLivestock({
      animal_name: '',
      breed: '',
      age: '',
      weight: '',
      births: '',
    });
    setImage(null);
    setModalVisible(false);
  };

  // Delete livestock
  const handleDelete = async (animalId: string) => {
    try {
      await axios.delete(`${API_URL}?animal_id=${animalId}`);
      fetchLivestock();
      showToast('Livestock deleted successfully', ToastType.SUCCESS);
    } catch (error) {
      console.error('Error deleting livestock:', error);
      showToast('Failed to delete livestock', ToastType.ERROR);
    }
  };

  // Edit livestock
  const handleEdit = (item: Livestock) => {
    setCurrentLivestock({...item});
    if (item.photo) {
      setImage({ uri: item.photo });
    } else {
      setImage(null);
    }
    setModalVisible(true);
  };

  // Render individual livestock item
  const renderLivestockItem = ({ item }: { item: Livestock }) => (
    <View style={styles.livestockCard}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.livestockImage} />
      ) : (
        <View style={[styles.livestockImage, styles.placeholderImage]}>
          <Ionicons name="paw-outline" size={40} color={colors.secondary} />
        </View>
      )}
      
      <View style={styles.livestockInfo}>
        <Text style={styles.livestockName}>{item.animal_name}</Text>
        <Text style={styles.livestockDetail}>Breed: {item.breed}</Text>
        <Text style={styles.livestockDetail}>Age: {item.age}</Text>
        {item.weight && <Text style={styles.livestockDetail}>Weight: {item.weight}</Text>}
        {item.births && <Text style={styles.livestockDetail}>Births: {item.births}</Text>}
      </View>
      
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item.animal_id || '')}
        >
          <Ionicons name="trash-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Livestock</Text>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Add New Livestock</Text>
      </TouchableOpacity>

      <FlatList
        data={livestock}
        keyExtractor={(item, index) => {
          if (item.animal_id) return `livestock-${item.animal_id}`;
          return `livestock-${index}-${item.animal_name}`;
        }}
        renderItem={renderLivestockItem}
        ListEmptyComponent={<Text style={styles.emptyList}>No livestock added yet</Text>}
      />

      {/* Add/Edit livestock modal */}
      <Modal
        animationType="slide"
        key={modalKey}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentLivestock.animal_id ? 'Edit Livestock' : 'Add New Livestock'}
            </Text>
            
            {/* Image picker */}
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={40} color={colors.primary} />
                  <Text style={styles.imageUploadText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>
            
            {/* Form fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Animal Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Animal Name"
                value={currentLivestock.animal_name}
                onChangeText={(text) => setCurrentLivestock({...currentLivestock, animal_name: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Breed *</Text>
              <TextInput
                style={styles.input}
                placeholder="Breed"
                value={currentLivestock.breed}
                onChangeText={(text) => setCurrentLivestock({...currentLivestock, breed: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                placeholder="Age (years)"
                keyboardType="numeric"
                value={currentLivestock.age}
                onChangeText={(text) => setCurrentLivestock({...currentLivestock, age: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={currentLivestock.weight}
                onChangeText={(text) => setCurrentLivestock({...currentLivestock, weight: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Births</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of Births"
                keyboardType="numeric"
                value={currentLivestock.births}
                onChangeText={(text) => setCurrentLivestock({...currentLivestock, births: text})}
              />
            </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
              <Text style={styles.addButtonText}>
                {currentLivestock.animal_id ? 'Update Livestock' : 'Add Livestock'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Toast Modal */}
      <ToastModal 
        message={message}
        type={type}
        isVisible={isVisible}
      />
    </View>
  );
};

// You need to create a TextInput component since it's not imported
const TextInput = ({ style, ...props }) => {
  // This assumes you're using React Native's TextInput
  const { TextInput: RNTextInput } = require('react-native');
  return <RNTextInput style={style} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  livestockCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  livestockImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  placeholderImage: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  actionButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '90%',
  },
  editButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: 10,
    borderRadius: 5,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    maxWidth: 400,
    alignSelf: 'center',
    marginVertical: 40,
    borderWidth: 1,
    borderColor: colors.secondary,
    minWidth: 300,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  imageUpload: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadText: {
    color: colors.primary,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: 'lightgray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LivestockProfiles;
