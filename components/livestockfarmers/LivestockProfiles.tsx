import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Modal, 
  TextInput, Image, StyleSheet, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Constants
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

// Type Definitions
type Livestock = {
  animal_id?: string;
  animal_name: string;
  breed: string;
  age: string;
  weight: string;
  births?: string;
  photo?: string;
};

const LivestockProfiles: React.FC = () => {
  // State Management
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState<Livestock>({
    animal_name: '',
    breed: '',
    age: '',
    weight: '',
    births: '',
  });
  const [image, setImage] = useState<{ uri: string } | null>(null);

  // Image Selection
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
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Fetch Livestock
  const fetchLivestock = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock:', error);
      Alert.alert('Error', 'Failed to fetch livestock profiles');
    }
  };

  // Add Livestock
  const addLivestock = async () => {
    if (!currentLivestock.animal_name || !currentLivestock.breed) {
      Alert.alert('Validation Error', 'Name and Breed are required');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(currentLivestock).forEach(key => {
        formData.append(key, currentLivestock[key as keyof Livestock] || '');
      });

      if (image) {
        formData.append('photo', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'livestock_photo.jpg',
        } as any);
      }

      await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchLivestock();
      resetForm();
    } catch (error) {
      console.error('Error adding livestock:', error);
      Alert.alert('Error', 'Failed to add livestock profile');
    }
  };

  // Update Livestock
  const updateLivestock = async () => {
    if (!currentLivestock.animal_id) return;

    try {
      const formData = new FormData();
      Object.keys(currentLivestock).forEach(key => {
        formData.append(key, currentLivestock[key as keyof Livestock] || '');
      });

      if (image) {
        formData.append('photo', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'livestock_photo.jpg',
        } as any);
      }

      await axios.put(`${API_BASE_URL}?animal_id=${currentLivestock.animal_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchLivestock();
      resetForm();
    } catch (error) {
      console.error('Error updating livestock:', error);
      Alert.alert('Error', 'Failed to update livestock profile');
    }
  };

  // Delete Livestock
  const deleteLivestock = async (animal_id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}?animal_id=${animal_id}`);
      fetchLivestock();
    } catch (error) {
      console.error('Error deleting livestock:', error);
      Alert.alert('Error', 'Failed to delete livestock profile');
    }
  };

  // Reset Form
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

  // Edit Livestock
  const editLivestock = (livestock: Livestock) => {
    setCurrentLivestock(livestock);
    setEditMode(true);
    setModalVisible(true);
  };

  // Lifecycle Effect
  useEffect(() => {
    fetchLivestock();
  }, []);

  // Render Livestock Item
  const renderLivestockItem = ({ item }: { item: Livestock }) => (
    <View style={styles.livestockCard}>
      <Image 
        source={{ uri: item.photo || '/api/placeholder/150/150' }} 
        style={styles.livestockImage} 
      />
      <View style={styles.livestockInfo}>
        <Text style={styles.livestockName}>{item.animal_name}</Text>
        <Text style={styles.livestockDetail}>Breed: {item.breed}</Text>
        <Text style={styles.livestockDetail}>Age: {item.age}</Text>
        <Text style={styles.livestockDetail}>Weight: {item.weight}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => editLivestock(item)}
        >
          <Ionicons name="create" size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteLivestock(item.animal_id!)}
        >
          <Ionicons name="trash" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Livestock Profiles</Text>
      <FlatList
        data={livestock}
        renderItem={renderLivestockItem}
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
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
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
              value={currentLivestock.animal_name}
              onChangeText={(text) => setCurrentLivestock({
                ...currentLivestock, 
                animal_name: text
              })}
            />
            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={currentLivestock.breed}
              onChangeText={(text) => setCurrentLivestock({
                ...currentLivestock, 
                breed: text
              })}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={currentLivestock.age}
              onChangeText={(text) => setCurrentLivestock({
                ...currentLivestock, 
                age: text
              })}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              value={currentLivestock.weight}
              onChangeText={(text) => setCurrentLivestock({
                ...currentLivestock, 
                weight: text
              })}
            />
            <TextInput
              style={styles.input}
              placeholder="Births"
              value={currentLivestock.births}
              onChangeText={(text) => setCurrentLivestock({
                ...currentLivestock, 
                births: text
              })}
            />

            <TouchableOpacity 
              style={styles.addButtonModal} 
              onPress={editMode ? updateLivestock : addLivestock}
            >
              <Text style={styles.addButtonText}>
                {editMode ? 'Update Livestock' : 'Add Livestock'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image, StyleSheet } from 'react-native';
// import { Plus, X, Camera } from 'lucide-react';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const colors = {
//   primary: '#4CAF50',
//   secondary: '#8BC34A',
//   text: '#333333',
//   background: '#F1F8E9',
//   white: '#FFFFFF',
//   error: '#FF6B6B',
//   black: '#000000',
//   gray: '#E0E0E0',
// };

// type Livestock = {
//   id: string;
//   name: string;
//   breed: string;
//   age: string;
//   weight: string;
//   imageUrl: string;
// };

// const initialLivestock: Livestock[] = [
//   {
//     id: '1',
//     name: 'Bessie',
//     breed: 'Holstein',
//     age: '4 years',
//     weight: '1200 lbs',
//     imageUrl: '/api/placeholder/150/150',
//   },
//   {
//     id: '2',
//     name: 'Spot',
//     breed: 'Angus',
//     age: '2 years',
//     weight: '900 lbs',
//     imageUrl: '/api/placeholder/150/150',
//   },
// ];

// const LivestockProfiles: React.FC = () => {
//   const [livestock, setLivestock] = useState<Livestock[]>(initialLivestock);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newLivestock, setNewLivestock] = useState<Partial<Livestock>>({});

//   const addLivestock = () => {
//     if (newLivestock.name && newLivestock.breed && newLivestock.age && newLivestock.weight) {
//       setLivestock([
//         ...livestock,
//         {
//           id: Date.now().toString(),
//           imageUrl: '/api/placeholder/150/150',
//           ...newLivestock as Livestock,
//         },
//       ]);
//       setNewLivestock({});
//       setModalVisible(false);
//     }
//   };

//   const renderLivestockItem = ({ item }: { item: Livestock }) => (
//     <View style={styles.livestockCard}>
//       <Image source={{ uri: item.imageUrl }} style={styles.livestockImage} />
//       <View style={styles.livestockInfo}>
//         <Text style={styles.livestockName}>{item.name}</Text>
//         <Text style={styles.livestockDetail}>Breed: {item.breed}</Text>
//         <Text style={styles.livestockDetail}>Age: {item.age}</Text>
//         <Text style={styles.livestockDetail}>Weight: {item.weight}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Livestock Profiles</Text>
//       <FlatList
//         data={livestock}
//         renderItem={renderLivestockItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//         {/* <Plus color={colors.white} size={24} /> */}
//         <Ionicons name="add-circle" size={24} color={colors.white} />
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//               {/* <X color={colors.text} size={24} /> */}
//               <Ionicons name="close-circle" size={24} color={colors.text} />
//             </TouchableOpacity>
//             <Text style={styles.modalTitle}>Add New Livestock</Text>

//             <TouchableOpacity style={styles.imageUpload}>
//               <Ionicons name="image" size={40} color={colors.primary} />
//               <Text style={styles.imageUploadText}>Upload Image</Text>
//             </TouchableOpacity>

//             <TextInput
//               style={styles.input}
//               placeholder="Name"
//               value={newLivestock.name}
//               onChangeText={(text) => setNewLivestock({ ...newLivestock, name: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Breed"
//               value={newLivestock.breed}
//               onChangeText={(text) => setNewLivestock({ ...newLivestock, breed: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Age"
//               value={newLivestock.age}
//               onChangeText={(text) => setNewLivestock({ ...newLivestock, age: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Weight"
//               value={newLivestock.weight}
//               onChangeText={(text) => setNewLivestock({ ...newLivestock, weight: text })}
//             />

//             <TouchableOpacity style={styles.addButtonModal} onPress={addLivestock}>
//               <Text style={styles.addButtonText}>Add Livestock</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 16,
//   },
//   listContainer: {
//     paddingBottom: 80,
//   },
//   livestockCard: {
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   livestockImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 16,
//   },
//   livestockInfo: {
//     flex: 1,
//   },
//   livestockName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 4,
//   },
//   livestockDetail: {
//     fontSize: 14,
//     color: colors.text,
//     marginBottom: 2,
//   },
//   addButton: {
//     position: 'absolute',
//     right: 16,
//     bottom: 16,
//     backgroundColor: colors.primary,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     padding: 20,
//     width: '90%',
//     maxWidth: 400,
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   imageUpload: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.background,
//     borderRadius: 10,
//     height: 120,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: colors.gray,
//   },
//   imageUploadText: {
//     color: colors.text,
//     marginTop: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.gray,
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 12,
//   },
//   addButtonModal: {
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: colors.white,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default LivestockProfiles;