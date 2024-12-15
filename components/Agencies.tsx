import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Platform, 
  Alert, 
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import CustomHeader from './subcomponents/CustomHeader';

// Color Scheme
const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000'
};

// Types for form data
type AgencyFormData = {
  category?: string;
  name: string;
  description: string;
  specialty: string;
  email: string;
  phoneNumber: string;
  certificateFile?: any;
  licenseNumber?: string;
};

const CategoryPickerModal = ({ 
    visible, 
    onClose, 
    onSelectCategory, 
    selectedCategory 
  }) => {
    // Define categories
    const categories = [
      { id: 'insurance', name: 'Insurance' },
      { id: 'agrobusiness', name: 'AgroBusiness' }
    ];
  
    const renderItem = ({ item }: { item: { id: string; name: string } }) => (
      <TouchableOpacity 
        style={[
          styles.categoryItem, 
          selectedCategory === item.id && styles.selectedCategoryItem
        ]}
        onPress={() => {
          onSelectCategory(item.id);
          onClose();
        }}
      >
        <Text style={styles.categoryItemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

const API_BASE_URL = 'https://agrifit-f87fada7b265.herokuapp.com/';

const Agencies: React.FC = ({ navigation }: { navigation: any }) => {
  const [activeTab, setActiveTab] = useState<'agency' | 'veterinarian'>('agency');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [formData, setFormData] = useState<AgencyFormData>({
    name: '',
    description: '',
    specialty: '',
    email: '',
    phoneNumber: '',
    category: '',
    certificateFile: null,
    licenseNumber: ''
  });

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          certificateFile: result.assets[0]
        }));
      }
    } catch (err) {
      console.error('Document pick error:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSubmit = new FormData();
      
      if (activeTab === 'agency') {
        // Validate agency form
        if (!formData.category || !formData.name || !formData.email || !formData.phoneNumber || !formData.certificateFile) {
          Alert.alert('Validation Error', 'Please fill in all required fields');
          return;
        }

        // Append agency data
        formDataToSubmit.append('category', formData.category);
        formDataToSubmit.append('agency_name', formData.name);
        formDataToSubmit.append('description', formData.description);
        formDataToSubmit.append('business_email', formData.email);
        formDataToSubmit.append('phone_number', formData.phoneNumber);
        if (formData.certificateFile) {
          formDataToSubmit.append('business_certificate', {
            uri: formData.certificateFile.uri,
            type: formData.certificateFile.mimeType,
            name: formData.certificateFile.name
          } as any);
        }

        
        const response = await axios.post(`${API_BASE_URL}/agencies.php`, formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        Alert.alert('Success', 'Agency registered successfully');
      } else {
        // Validate veterinarian form
        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.licenseNumber) {
          Alert.alert('Validation Error', 'Please fill in all required fields');
          return;
        }

        const response = await axios.post(`${API_BASE_URL}/veterinarians.php`, {
          name: formData.name,
          specialty: formData.specialty,
          email: formData.email,
          phone_number: formData.phoneNumber,
          license: formData.licenseNumber
        });

        Alert.alert('Success', 'Veterinarian registered successfully');
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        specialty: '',
        email: '',
        phoneNumber: '',
        category: '',
        certificateFile: null,
        licenseNumber: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit registration');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
      >
        <CustomHeader navigation={navigation} />

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'agency' ? styles.activeTab : {}
            ]}
            onPress={() => setActiveTab('agency')}
          >
            <Text style={styles.tabText}>Insurance/AgroBusiness</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'veterinarian' ? styles.activeTab : {}
            ]}
            onPress={() => setActiveTab('veterinarian')}
          >
            <Text style={styles.tabText}>Veterinarian</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {activeTab === 'agency' && (
            <>
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Category</Text>
                <TouchableOpacity 
                  style={styles.picker}
                  onPress={() => setIsCategoryModalVisible(true)}
                >
                  <Text>
                    {formData.category 
                    ? (formData.category === 'insurance' ? 'Insurance' : 'AgroBusiness')
                    : 'Select Category'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* CategoryPickerModal */}
              <CategoryPickerModal
                visible={isCategoryModalVisible}
                onClose={() => setIsCategoryModalVisible(false)}
                onSelectCategory={(category: any) => 
                  setFormData(prev => ({...prev, category}))
                }
                selectedCategory={formData.category}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter Description"
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({...prev, description: text}))}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData(prev => ({...prev, phoneNumber: text}))}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={handleDocumentPick}
              >
                <Text style={styles.uploadButtonText}>
                  {formData.certificateFile 
                    ? formData.certificateFile.name 
                    : 'Upload Business Registration Certificate'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'veterinarian' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Specialty</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter Specialty"
                  value={formData.specialty}
                  onChangeText={(text) => setFormData(prev => ({...prev, specialty: text}))}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData(prev => ({...prev, phoneNumber: text}))}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>License Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter License Number"
                  value={formData.licenseNumber}
                  onChangeText={(text) => setFormData(prev => ({...prev, licenseNumber: text}))}
                />
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit Registration</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    padding: 12,
    backgroundColor: colors.white,
  },
  uploadButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary,
  },
  categoryItemText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default Agencies;