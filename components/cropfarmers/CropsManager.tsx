import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; // Make sure to install axios: npm install axios
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://agrifit.42web.io/crop_profile.php'; // Replace with your actual backend URL

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
};

type Crop = {
  crop_id?: string;
  owner_id?: string;
  crop_name: string;
  planting_date: string;
  harvest_time: string;
  amount_planted: string;
};

const CropsManager = () => {
  const [cropName, setCropName] = useState('');
  const [plantedOn, setPlantedOn] = useState<Date | null>(null);
  const [harvestTime, setHarvestTime] = useState<Date | null>(null);
  const [details, setDetails] = useState('');
  const [isSeedlingsSelected, setIsSeedlingsSelected] = useState(true);
  const [cropList, setCropList] = useState<Crop[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlantedOnPicker, setShowPlantedOnPicker] = useState(false);
  const [showHarvestTimePicker, setShowHarvestTimePicker] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const modalKey = modalVisible ? 'modal-open' : 'modal-closed';


  // Fetch crops when component mounts
  useEffect(() => {
    fetchCrops();
  }, []);

  // Fetch crops from backend
  const fetchCrops = async () => {
    try {
      const response = await axios.get(API_URL);
      setCropList(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert('Error', 'Failed to fetch crops');
    }
  };

  // Add or Update crop
  // const handleSubmitCrop = async () => {
  //   if (cropName && plantedOn && harvestTime && details) {
  //     const owner = await AsyncStorage.getItem('sellerId');

  //   if (!owner) {
  //       Alert.alert('Error', 'Owner ID not found in storage');
  //       return;
  //   }
  //     try {
  //       const cropData: Crop = {
  //         crop_name: cropName,
  //         planting_date: plantedOn.toLocaleDateString(),
  //         harvest_time: harvestTime.toLocaleDateString(),
  //         amount_planted: details,
  //         owner_id: owner, // Replace with actual user ID
  //       };

  //       let response;
  //       console.log("Response:", cropData);
  //       if (editingCrop) {
  //         // Update existing crop
  //         response = await axios.post(`${API_URL}?crop_id=${editingCrop.crop_id}`, cropData);
  //       } else {
  //         // Add new crop
  //         response = await axios.post(API_URL, cropData);
  //       }

  //       // Refresh crop list
  //       fetchCrops();
  //       resetForm();
  //       setModalVisible(false);
  //       setEditingCrop(null);
  //     } catch (error) {
  //       console.error('Error saving crop:', error);
  //       Alert.alert('Error', 'Failed to save crop');
  //     }
  //   } else {
  //     Alert.alert('Validation Error', 'Please fill in all fields');
  //   }
  // };
  const handleSubmitCrop = async () => {
    if (cropName && plantedOn && harvestTime && details) {
      const owner = await AsyncStorage.getItem('sellerId');

      if (!owner) {
          Alert.alert('Error', 'Owner ID not found in storage');
          return;
      }

      try {
        // Ensure dates are converted to ISO string or specific format
        const cropData = {
          crop_name: cropName,
          planting_date: plantedOn.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          harvest_time: harvestTime.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          amount_planted: details,
          owner_id: owner, // Replace with actual user ID
        };
  
        // Log the exact data being sent
        console.log("Sending crop data:", cropData);
  
        let response;
        if (editingCrop) {
          // Use FormData or URLSearchParams to ensure proper data transmission
          const formData = new FormData();
          Object.keys(cropData).forEach(key => {
            formData.append(key, cropData[key]);
          });
  
          response = await axios.post(`${API_URL}?crop_id=${editingCrop.crop_id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          const formData = new FormData();
          Object.keys(cropData).forEach(key => {
            formData.append(key, cropData[key]);
          });
  
          response = await axios.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
  
        console.log("Full response:", response);
  
        // Refresh crop list
        fetchCrops();
        resetForm();
        setModalVisible(false);
        setEditingCrop(null);
      } catch (error) {
        console.error('Error saving crop:', error.response ? error.response.data : error);
        Alert.alert('Error', 'Failed to save crop');
      }
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields');
    }
  };

  // Delete crop
  const handleDeleteCrop = async (cropId: string) => {
    try {
      await axios.delete(`${API_URL}?crop_id=${cropId}`);
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
      Alert.alert('Error', 'Failed to delete crop');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setCropName('');
    setPlantedOn(null);
    setHarvestTime(null);
    setDetails('');
    setIsSeedlingsSelected(true);
  };

  // Prepare crop for editing
  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setCropName(crop.crop_name);
    setDetails(crop.amount_planted);
    setPlantedOn(new Date(crop.planting_date));
    setHarvestTime(new Date(crop.harvest_time));
    setModalVisible(true);
  };

  // Render individual crop item
  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropCard}>
      <Text style={styles.cropName}>{item.crop_name}</Text>
      <Text>Planted On: {item.planting_date}</Text>
      <Text>Expected Harvest: {item.harvest_time}</Text>
      {/* <Text>{item.amount_planted.includes('acre') ? 'Area: ' : 'Seedlings: '}{item.amount_planted}</Text> */}
      <Text>{item.amount_planted?.includes('acre') ? `Area: ${item.amount_planted}` : `Seedlings: ${item.amount_planted ?? 'N/A'}`}</Text>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEditCrop(item)}
        >
          <Ionicons name="create-outline" size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteCrop(item.crop_id || '')}
        >
          <Ionicons name="trash-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Crops</Text>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => {
          resetForm();
          setEditingCrop(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Add New Crop</Text>
      </TouchableOpacity>

      <FlatList
        data={cropList}
        // keyExtractor={(item) => item.crop_id || ''}
        keyExtractor={(item, index) => {
          // Use crop_id if available
          if (item.crop_id) return `crop-${item.crop_id}`;
          
          // Fallback to a combination of index and some unique identifier
          return `crop-${index}-${item.crop_name}-${item.planting_date}`;
        }}
        renderItem={renderCropItem}
        ListEmptyComponent={<Text style={styles.emptyList}>No crops added yet</Text>}
      />

      {/* Modal remains mostly the same as in the original code */}
      <Modal
        animationType="slide"
        key={modalKey} 
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Crop Name"
              value={cropName}
              onChangeText={setCropName}
            />

            {/* Date Pickers remain the same */}
            <TouchableOpacity
              onPress={() => setShowPlantedOnPicker(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>
                {plantedOn ? plantedOn.toLocaleDateString() : 'Planted On'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.black} />
            </TouchableOpacity>

            {showPlantedOnPicker && (
              <DateTimePicker
                value={plantedOn || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPlantedOnPicker(false);
                  if (selectedDate) setPlantedOn(selectedDate);
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowHarvestTimePicker(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>
                {harvestTime ? harvestTime.toLocaleDateString() : 'Expected Harvest Time'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.black} />
            </TouchableOpacity>

            {showHarvestTimePicker && (
              <DateTimePicker
                value={harvestTime || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowHarvestTimePicker(false);
                  if (selectedDate) setHarvestTime(selectedDate);
                }}
              />
            )}

            <View style={styles.switchContainer}>
              <TouchableOpacity
                onPress={() => setIsSeedlingsSelected(true)}
                style={[
                  styles.switchButton,
                  isSeedlingsSelected && styles.activeButton
                ]}
              >
                <Text style={styles.switchText}>Seedlings Planted</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSeedlingsSelected(false)}
                style={[
                  styles.switchButton,
                  !isSeedlingsSelected && styles.activeButton
                ]}
              >
                <Text style={styles.switchText}>Area of Land Planted</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={isSeedlingsSelected ? 'Number of Seedlings' : 'Area of Land Planted (e.g., 1/2 acre)'}
              value={details}
              onChangeText={setDetails}
            />

            <TouchableOpacity onPress={handleSubmitCrop} style={styles.addButton}>
              <Text style={styles.addButtonText}>{editingCrop ? 'Update Crop' : 'Add Crop'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};



  
// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const colors = {
//   primary: '#4CAF50',
//   secondary: '#8BC34A',
//   text: '#333333',
//   background: '#F1F8E9',
//   white: '#FFFFFF',
//   error: '#FF6B6B',
//   black: '#000000',
// };

// type Crop = {
//   id: string;
//   name: string;
//   plantedOn: string;
//   harvestTime: string;
//   details: string;
// };

// const CropsManager = () => {
//   const [cropName, setCropName] = useState('');
//   const [plantedOn, setPlantedOn] = useState<Date | null>(null);
//   const [harvestTime, setHarvestTime] = useState<Date | null>(null);
//   const [details, setDetails] = useState('');
//   const [isSeedlingsSelected, setIsSeedlingsSelected] = useState(true);
//   const [cropList, setCropList] = useState<Crop[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showPlantedOnPicker, setShowPlantedOnPicker] = useState(false);
//   const [showHarvestTimePicker, setShowHarvestTimePicker] = useState(false);

//   const handleAddCrop = () => {
//     if (cropName && plantedOn && harvestTime && details) {
//       const newCrop = {
//         id: Date.now().toString(),
//         name: cropName,
//         plantedOn: plantedOn.toLocaleDateString(),
//         harvestTime: harvestTime.toLocaleDateString(),
//         details: details,
//       };
//       setCropList([...cropList, newCrop]);
//       resetForm();
//       setModalVisible(false);
//     }
//   };

//   const resetForm = () => {
//     setCropName('');
//     setPlantedOn(null);
//     setHarvestTime(null);
//     setDetails('');
//     setIsSeedlingsSelected(true);
//   };

//   const renderCropItem = ({ item }: { item: Crop }) => (
//     <View style={styles.cropCard}>
//       <Text style={styles.cropName}>{item.name}</Text>
//       <Text>Planted On: {item.plantedOn}</Text>
//       <Text>Expected Harvest: {item.harvestTime}</Text>
//       <Text>{item.details.includes('acre') ? 'Area: ' : 'Seedlings: '}{item.details}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Crops</Text>
      
//       <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//         <Text style={styles.addButtonText}>Add New Crop</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={cropList}
//         keyExtractor={(item) => item.id}
//         renderItem={renderCropItem}
//         ListEmptyComponent={<Text style={styles.emptyList}>No crops added yet</Text>}
//       />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add New Crop</Text>
            
//             <TextInput
//               style={styles.input}
//               placeholder="Crop Name"
//               value={cropName}
//               onChangeText={setCropName}
//             />

//             <TouchableOpacity
//               onPress={() => setShowPlantedOnPicker(true)}
//               style={styles.dateInput}
//             >
//               <Text style={styles.dateText}>
//                 {plantedOn ? plantedOn.toLocaleDateString() : 'Planted On'}
//               </Text>
//               <Ionicons name="calendar-outline" size={20} color={colors.black} />
//             </TouchableOpacity>

//             {showPlantedOnPicker && (
//               <DateTimePicker
//                 value={plantedOn || new Date()}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selectedDate) => {
//                   setShowPlantedOnPicker(false);
//                   if (selectedDate) setPlantedOn(selectedDate);
//                 }}
//               />
//             )}

//             <TouchableOpacity
//               onPress={() => setShowHarvestTimePicker(true)}
//               style={styles.dateInput}
//             >
//               <Text style={styles.dateText}>
//                 {harvestTime ? harvestTime.toLocaleDateString() : 'Expected Harvest Time'}
//               </Text>
//               <Ionicons name="calendar-outline" size={20} color={colors.black} />
//             </TouchableOpacity>

//             {showHarvestTimePicker && (
//               <DateTimePicker
//                 value={harvestTime || new Date()}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selectedDate) => {
//                   setShowHarvestTimePicker(false);
//                   if (selectedDate) setHarvestTime(selectedDate);
//                 }}
//               />
//             )}

//             <View style={styles.switchContainer}>
//               <TouchableOpacity
//                 onPress={() => setIsSeedlingsSelected(true)}
//                 style={[
//                   styles.switchButton,
//                   isSeedlingsSelected && styles.activeButton
//                 ]}
//               >
//                 <Text style={styles.switchText}>Seedlings Planted</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setIsSeedlingsSelected(false)}
//                 style={[
//                   styles.switchButton,
//                   !isSeedlingsSelected && styles.activeButton
//                 ]}
//               >
//                 <Text style={styles.switchText}>Area of Land Planted</Text>
//               </TouchableOpacity>
//             </View>

//             <TextInput
//               style={styles.input}
//               placeholder={isSeedlingsSelected ? 'Number of Seedlings' : 'Area of Land Planted (e.g., 1/2 acre)'}
//               value={details}
//               onChangeText={setDetails}
//             />

//             <TouchableOpacity onPress={handleAddCrop} style={styles.addButton}>
//               <Text style={styles.addButtonText}>Add Crop</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// };


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
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginBottom: 12,
  },
  dateText: {
    color: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginRight: 5,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  switchText: {
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cropCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    minWidth: '90%',
    maxHeight: '80%',
    marginVertical: 'auto'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'lightgray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: 10,
    borderRadius: 5,
  },
});

export default CropsManager;
