import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast, ToastModal, ToastType } from '../subcomponents/Toast';

const API_URL = 'https://agrifit-backend-production.up.railway.app/crop_profile.php';

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
  planting_type?: string; // Added for tracking seedlings or area
};

const CropsManager = () => {
  const [cropName, setCropName] = useState('');
  const [plantedOn, setPlantedOn] = useState<Date | null>(null);
  const [harvestTime, setHarvestTime] = useState<Date | null>(null);
  const [details, setDetails] = useState('');
  const [isSeedlingsSelected, setIsSeedlingsSelected] = useState(true);
  const [areaUnit, setAreaUnit] = useState<'m²' | 'acres'>('acres');
  const [cropList, setCropList] = useState<Crop[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlantedOnPicker, setShowPlantedOnPicker] = useState(false);
  const [showHarvestTimePicker, setShowHarvestTimePicker] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const modalKey = modalVisible ? 'modal-open' : 'modal-closed';
  
  // Get toast functionality from the hook
  const { showToast, message, type, isVisible } = useToast();

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
      showToast('Failed to fetch crops', ToastType.ERROR);
    }
  };

  const handleSubmitCrop = async () => {
    if (cropName && plantedOn && harvestTime && details) {
      const owner = await AsyncStorage.getItem('sellerId');

      if (!owner) {
          showToast('Please try again', ToastType.ERROR);
          return;
      }

      try {
        // Format the amount_planted field to include type information
        const plantingType = isSeedlingsSelected ? 'seedlings' : 'area';
        const formattedDetails = isSeedlingsSelected 
          ? `${details} seedlings` 
          : `${details} ${areaUnit}`;

        // Ensure dates are converted to ISO string or specific format
        const cropData = {
          crop_name: cropName,
          planting_date: plantedOn.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          harvest_time: harvestTime.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          amount_planted: formattedDetails,
          planting_type: plantingType, // Add this field to track type
          owner_id: owner,
        };
  
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
          
          showToast('Crop details updated successfully', ToastType.SUCCESS);
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
  
        // console.log("Full response:", response);
  
        // Refresh crop list
        fetchCrops();
        resetForm();
        setModalVisible(false);
        setEditingCrop(null);
      } catch (error) {
        console.error('Error saving crop:', error);
        showToast('Failed to add crop details. Try again', ToastType.ERROR);
      }
    showToast('Crop details added successfully', ToastType.SUCCESS);
    } else {
      showToast('Please fill in all fields', ToastType.ERROR);
    }
  };

  // Delete crop
  const handleDeleteCrop = async (cropId: string) => {
    try {
      await axios.delete(`${API_URL}?crop_id=${cropId}`);
      
      fetchCrops();
      showToast('Crop deleted!', ToastType.SUCCESS);
    } catch (error) {
      console.error('Error deleting crop:', error);
      showToast('Failed to delete crop. Try again', ToastType.ERROR);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setCropName('');
    setPlantedOn(null);
    setHarvestTime(null);
    setDetails('');
    setIsSeedlingsSelected(true);
    setAreaUnit('acres');
  };

  // Prepare crop for editing
  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setCropName(crop.crop_name);
    
    // Parse the amount_planted to determine type and value
    const amountPlanted = crop.amount_planted || '';
    
    // Check if it contains "seedlings"
    if (amountPlanted.includes('seedlings')) {
      setIsSeedlingsSelected(true);
      setDetails(amountPlanted.replace(' seedlings', ''));
    } 
    // Check if it contains area units
    else if (amountPlanted.includes('m²') || amountPlanted.includes('acres')) {
      setIsSeedlingsSelected(false);
      
      if (amountPlanted.includes('m²')) {
        setAreaUnit('m²');
        setDetails(amountPlanted.replace(' m²', ''));
      } else {
        setAreaUnit('acres');
        setDetails(amountPlanted.replace(' acres', ''));
      }
    } 
    // Default fallback
    else {
      setIsSeedlingsSelected(true);
      setDetails(amountPlanted);
    }
    
    setPlantedOn(new Date(crop.planting_date));
    setHarvestTime(new Date(crop.harvest_time));
    setModalVisible(true);
  };

  // Parse display text for amount planted
  const getPlantingDisplayText = (amountPlanted: string) => {
    if (amountPlanted?.includes('seedlings')) {
      return `Seedlings: ${amountPlanted}`;
    } else if (amountPlanted?.includes('m²') || amountPlanted?.includes('acres')) {
      return `Area: ${amountPlanted}`;
    }
    return `Amount: ${amountPlanted ?? 'N/A'}`;
  };

  // Render individual crop item
  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropCard}>
      <Text style={styles.cropName}>{item.crop_name}</Text>
      <Text>Planted On: {item.planting_date}</Text>
      <Text>Expected Harvest: {item.harvest_time}</Text>
      <Text>{getPlantingDisplayText(item.amount_planted)}</Text>
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
      <Text style={styles.title}>My Crops</Text>
      
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
        keyExtractor={(item, index) => {
          if (item.crop_id) return `crop-${item.crop_id}`;
          return `crop-${index}-${item.crop_name}-${item.planting_date}`;
        }}
        renderItem={renderCropItem}
        ListEmptyComponent={<Text style={styles.emptyList}>No crops added yet</Text>}
      />

      {/* Add crop modal */}
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

            {/* Planting Type Selection */}
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

            {/* Input with units selection if area is chosen */}
            {isSeedlingsSelected ? (
              <TextInput
                style={styles.input}
                placeholder="Number of Seedlings"
                value={details}
                keyboardType="numeric"
                onChangeText={setDetails}
              />
            ) : (
              <View style={styles.inputWithUnits}>
                <TextInput
                  style={styles.unitInput}
                  placeholder="Area Value"
                  value={details}
                  keyboardType="numeric"
                  onChangeText={setDetails}
                />
                <View style={styles.unitSelector}>
                  <TouchableOpacity
                    onPress={() => setAreaUnit('acres')}
                    style={[
                      styles.unitButton,
                      areaUnit === 'acres' && styles.activeUnitButton
                    ]}
                  >
                    <Text style={styles.unitText}>acres</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setAreaUnit('m²')}
                    style={[
                      styles.unitButton,
                      areaUnit === 'm²' && styles.activeUnitButton
                    ]}
                  >
                    <Text style={styles.unitText}>m²</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity onPress={handleSubmitCrop} style={styles.addButton}>
              <Text style={styles.addButtonText}>{editingCrop ? 'Update Crop' : 'Add Crop'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <ToastModal 
          message={message}
          type={type}
          isVisible={isVisible}
        />
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
    // zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    minWidth: '90%',
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
  inputWithUnits: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  unitInput: {
    flex: 2,
    backgroundColor: colors.background,
    padding: 12,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  unitSelector: {
    flex: 1,
    flexDirection: 'row',
  },
  unitButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  activeUnitButton: {
    backgroundColor: colors.secondary,
  },
  unitText: {
    fontWeight: 'bold',
    color: colors.text,
  }
});

export default CropsManager;
