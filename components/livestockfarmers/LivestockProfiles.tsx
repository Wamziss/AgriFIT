import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Move styles to a separate file
import LivestockItem from './LivestockProfile/LivestockItem'; // Render livestock items
import LivestockForm from './LivestockProfile/LivestockForm'; // Manage add/edit forms

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app/livestock_profile.php';

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


const LivestockProfiles = () => {
  const [livestock, setLivestock] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState({
    animal_name: '',
    breed: '',
    age: '',
    weight: '',
    births: '',
  });
  const [image, setImage] = useState<{ uri: string } | null>(null);

  // Fetch livestock
  const fetchLivestock = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setLivestock(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch livestock profiles');
    }
  };

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
    setEditMode(false);
  };

  useEffect(() => {
    fetchLivestock();
  }, []);

  const handleEdit = (item) => {
    setCurrentLivestock(item);
    setImage(item.photo ? { uri: item.photo } : null);
    setEditMode(true);
    setModalVisible(true);
};

const handleDelete = async (animal_id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}?animal_id=${animal_id}`);
        
        if (response.data.status === 'success') {
            Alert.alert('Success', 'Livestock profile deleted successfully');
            fetchLivestock();
        } else {
            Alert.alert('Error', response.data.message || 'Failed to delete livestock profile');
        }
    } catch (error) {
        console.error('Delete Error:', error);
        Alert.alert('Error', 'Failed to delete livestock profile');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Livestock Profiles</Text>
      <FlatList
        data={livestock}
        renderItem={({ item }) => (
          <LivestockItem
            item={item}
            onEdit={() => handleEdit(item)}

            onDelete={() => handleDelete(item.animal_id)}
          />
        )}
        keyExtractor={(item) => item.animal_id || Date.now().toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle" size={24} color={colors.white} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LivestockForm
          visible={modalVisible}
          livestock={currentLivestock}
          image={image}
          setImage={setImage}
          editMode={editMode}
          resetForm={resetForm}
          fetchLivestock={fetchLivestock}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginVertical: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
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

export default LivestockProfiles;
