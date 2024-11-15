import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ProductFormModal = ({ visible, onClose, onSubmit, productCategory, setProductCategory, subCategory, setSubCategory, name, setName, price, setPrice, location, setLocation, description, setDescription, loading }) => {

  const renderSubCategoryPicker = () => {
    if (productCategory === 'Produce') {
      return (
        <Picker
          selectedValue={subCategory}
          onValueChange={setSubCategory}
          style={styles.input}
        >
          <Picker.Item label="Select Sub Category" value="" />
          <Picker.Item label="Animal Produce" value="Animal Produce" />
          <Picker.Item label="Crop Produce" value="Crop Produce" />
        </Picker>
      );
    } else if (productCategory === 'Livestock Related') {
      return (
        <Picker
          selectedValue={subCategory}
          onValueChange={setSubCategory}
          style={styles.input}
        >
          <Picker.Item label="Select Sub Category" value="" />
          <Picker.Item label="Cattle/Cows" value="Cattle/Cows" />
          <Picker.Item label="Sheep" value="Sheep" />
          <Picker.Item label="Goats" value="Goats" />
          <Picker.Item label="Horse" value="Horse" />
          <Picker.Item label="Rabbits" value="Rabbits" />
          <Picker.Item label="Hens" value="Hens" />
          <Picker.Item label="Pigs" value="Pigs" />
        </Picker>
      );
    }
    return null;
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Add New Product</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Form fields */}
            <Picker
              selectedValue={productCategory}
              onValueChange={(value) => {
                setProductCategory(value);
                setSubCategory('');  // Reset subcategory when category changes
              }}
              style={styles.input}
            >
              <Picker.Item label="Select Product Category" value="" />
              <Picker.Item label="Produce" value="Produce" />
              <Picker.Item label="Crop Farming" value="Crop Farming" />
              <Picker.Item label="Livestock Related" value="Livestock Related" />
            </Picker>

            {renderSubCategoryPicker()}

            <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Price in KSh" value={price} keyboardType="numeric" onChangeText={setPrice} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

            <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Submit</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    
        modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        },
        modalContent: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        maxHeight: '80%',
        },
        modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        },
        modalHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        },
        closeButton: {
        padding: 5,
        },
        closeButtonText: {
        fontSize: 28,
        color: '#666666',
        fontWeight: 'bold',
        },
        input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#8BC34A',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        },
        textArea: {
        height: 100,
        textAlignVertical: 'top',
        },
        submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
        },
        submitButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        },
      
    });
  

export default ProductFormModal;
