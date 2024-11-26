import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.100.51/AgriFIT/livestock_profile.php';

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

const LivestockForm = ({
  visible,
  livestock: initialLivestock,
  image,
  setImage,
  editMode,
  resetForm,
  fetchLivestock,
}) => {
  const [livestock, setLivestock] = React.useState(initialLivestock);

  // Update local state when initial livestock changes
  React.useEffect(() => {
    setLivestock(initialLivestock);
  }, [initialLivestock]);

  const handleChange = (field, value) => {
    setLivestock((prev) => ({ ...prev, [field]: value }));
  };

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const saveLivestock = async () => {
    const owner = await AsyncStorage.getItem('sellerId');

    if (!owner) {
        Alert.alert('Error', 'Owner ID not found in storage');
        return;
    }
    
    const completeLivestock = {
        ...livestock,
        owner_id: owner,
    };

    // Check if all required fields are filled
    if (!completeLivestock.animal_name || !completeLivestock.breed) {
        Alert.alert('Validation Error', 'Name and Breed are required');
        return;
    }

    try {
        const formData = new FormData();
        Object.keys(completeLivestock).forEach((key) =>
            formData.append(key, completeLivestock[key] || '')
        );

        if (image) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            
            formData.append('photo', {
                uri: image.uri,
                type: `image/${fileType}`,
                name: `livestock_photo_${Date.now()}.${fileType}`
            });
        }
        console.log('Form Data:', formData);
        console.log(editMode);

        // const response = await axios.post(API_BASE_URL, formData, {
        //     headers: { 'Content-Type': 'multipart/form-data' },
        // });

        if (editMode) {
            // Make sure you're passing the correct `animal_id` to update the record
            const response = await axios.post(`${API_BASE_URL}?animal_id=${livestock.animal_id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Response:', response.data);

            if (response.data.status === 'success') {
                Alert.alert('Success', 'Livestock profile updated!');
                fetchLivestock();
                resetForm();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update livestock profile');
                console.log('Error', response.data.message || 'Failed to update livestock profile');
            }
        } else {
            const response = await axios.post(API_BASE_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.status === 'success') {
                Alert.alert('Success', 'Livestock profile saved successfully!');
                fetchLivestock();
                resetForm();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to save livestock profile');
            }
        }

        
    } catch (error) {
        console.error('Save Livestock Error:', error);
        Alert.alert('Error', 'Failed to save livestock profile');
    }
};  
    

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
          <Ionicons name="close-circle" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>
          {editMode ? 'Edit Livestock' : 'Add New Livestock'}
        </Text>

        <TouchableOpacity style={styles.imageUpload} onPress={selectImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
          ) : (
            <>
              <Ionicons name="image" size={40} color={colors.primary} />
              <Text style={styles.imageUploadText}>Upload Image</Text>
            </>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={livestock.animal_name}
          onChangeText={(text) => handleChange('animal_name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={livestock.breed}
          onChangeText={(text) => handleChange('breed', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={livestock.age}
          onChangeText={(text) => handleChange('age', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={livestock.weight}
          onChangeText={(text) => handleChange('weight', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Births"
          value={livestock.births}
          onChangeText={(text) => handleChange('births', text)}
        />
        <TouchableOpacity style={styles.addButtonModal} onPress={saveLivestock}>
          <Text style={styles.addButtonText}>
            {editMode ? 'Update Livestock' : 'Add Livestock'}
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
      width: '90%',
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
    },
    imageUpload: {
      width: 150,
      height: 150,
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderRadius: 10,
    },
    uploadedImage: {
      width: 150,
      height: 150,
      borderRadius: 10,
    },
    imageUploadText: {
      color: colors.primary,
      marginTop: 10,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    addButtonModal: {
      backgroundColor: colors.primary,
      width: '100%',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    addButtonText: {
      color: colors.white,
      fontWeight: 'bold',
    },
  });

export default LivestockForm;
