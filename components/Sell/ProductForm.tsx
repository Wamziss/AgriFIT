import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import * as MediaLibrary from 'expo-media-library';
  import * as Camera from 'expo-camera';
  import * as ImagePicker from 'expo-image-picker';

const ProductFormModal = ({
  visible,
  onClose,
  onSubmit,
  productCategory,
  setProductCategory,
  subCategory,
  setSubCategory,
  name,
  setName,
  price,
  setPrice,
  location,
  setLocation,
  description,
  setDescription,
  image,        
  setImage,  
  loading,
  isEditMode,
  productData,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  productCategory: string;
  setProductCategory: (category: string) => void;
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  location: string;
  setLocation: (location: string) => void;
  description: string;
  setDescription: (description: string) => void;
  image: { uri: string } | null;
  setImage: (image: { uri: string } | null) => void;
  loading: boolean;
  isEditMode: boolean;
  productData: any;
}) => {

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
  // const selectImage = async () => {
  //   try {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Permission to access media library is required!');
  //       return;
  //     }
  
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 1,
  //     });
  
  //     console.log('Image picker result:', result);
  
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       setImage({ uri: result.assets[0].uri });
  //     } else {
  //       console.log('Image selection canceled.');
  //     }
  //   } catch (error) {
  //     console.error('Error selecting image:', error);
  //   }
  // };
  
  
  const renderSubCategoryPicker = () => {
    if (productCategory === 'Produce') {
      return (
        <Picker selectedValue={subCategory} onValueChange={setSubCategory} style={styles.input}>
          <Picker.Item label="Select Sub Category" value="" />
          <Picker.Item label="Animal Produce" value="Animal Produce" />
          <Picker.Item label="Crop Produce" value="Crop Produce" />
        </Picker>
      );
    } else if (productCategory === 'Livestock Related') {
      return (
        <Picker selectedValue={subCategory} onValueChange={setSubCategory} style={styles.input}>
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
              <Text style={styles.modalHeaderText}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Form fields */}
            <Picker selectedValue={productCategory} onValueChange={(value) => {
              setProductCategory(value);
              setSubCategory('');
            }} style={styles.input}>
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

            {/* Image Upload */}
            <TouchableOpacity style={styles.imageUploadButton} onPress={selectImage}>
              <Text style={styles.imageUploadButtonText}>{image ? 'Change Image' : 'Upload Image'}</Text>
            </TouchableOpacity>

            {image && image.uri ? (
              <Image 
                source={image.uri ? { uri: image.uri } : require('../../assets/images/icon.png')}
                style={styles.imagePreview} 
                onError={(error) => console.log('Image loading error:', error)}
              />
            ) : null}


            <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>{isEditMode ? 'Update' : 'Submit'}</Text>}
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );};

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
  imageUploadButton: {
    backgroundColor: '#8BC34A',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageUploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 15,
  },
});

export default ProductFormModal;



  // If in edit mode, set the initial values of the fields
  // useEffect(() => {
  //   if (isEditMode && productData) {
  //     setProductCategory(productData.category);
  //     setSubCategory(productData.sub_category);
  //     setName(productData.name);
  //     setPrice(productData.price);
  //     setLocation(productData.location);
  //     setDescription(productData.description);
  //     setImage(productData.image ? { uri: productData.image } : null);
  //   }
  // }, [isEditMode, productData]);

  // const selectImage = async () => {
  //   // Ask for permission
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Permission to access media library is required!');
  //     return;
  //   }
  
  //   // Launch the image picker
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     quality: 1,
  //   });
  
  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     setImage({ uri: result.assets[0].uri });
  //   }
  // };  

  // const selectImage = async () => {
  //   try {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Permission to access media library is required!');
  //       return;
  //     }
    
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 1,
  //     });
    
  //     console.log('Image picker result:', result);
    
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       console.log('Selected image:', result.assets[0]);
  //       setImage({ uri: result.assets[0].uri });
  //     }
  //   } catch (error) {
  //     console.error('Error selecting image:', error);
  //   }
  // };


// import React from 'react';
// import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const ProductFormModal = ({ visible, onClose, onSubmit, productCategory, setProductCategory, subCategory, setSubCategory, name, setName, price, setPrice, location, setLocation, description, setDescription, loading }) => {

//   const renderSubCategoryPicker = () => {
//     if (productCategory === 'Produce') {
//       return (
//         <Picker
//           selectedValue={subCategory}
//           onValueChange={setSubCategory}
//           style={styles.input}
//         >
//           <Picker.Item label="Select Sub Category" value="" />
//           <Picker.Item label="Animal Produce" value="Animal Produce" />
//           <Picker.Item label="Crop Produce" value="Crop Produce" />
//         </Picker>
//       );
//     } else if (productCategory === 'Livestock Related') {
//       return (
//         <Picker
//           selectedValue={subCategory}
//           onValueChange={setSubCategory}
//           style={styles.input}
//         >
//           <Picker.Item label="Select Sub Category" value="" />
//           <Picker.Item label="Cattle/Cows" value="Cattle/Cows" />
//           <Picker.Item label="Sheep" value="Sheep" />
//           <Picker.Item label="Goats" value="Goats" />
//           <Picker.Item label="Horse" value="Horse" />
//           <Picker.Item label="Rabbits" value="Rabbits" />
//           <Picker.Item label="Hens" value="Hens" />
//           <Picker.Item label="Pigs" value="Pigs" />
//         </Picker>
//       );
//     }
//     return null;
//   };

//   return (
//     <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalHeaderText}>Add New Product</Text>
//               <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//                 <Text style={styles.closeButtonText}>×</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Form fields */}
//             <Picker
//               selectedValue={productCategory}
//               onValueChange={(value) => {
//                 setProductCategory(value);
//                 setSubCategory('');  // Reset subcategory when category changes
//               }}
//               style={styles.input}
//             >
//               <Picker.Item label="Select Product Category" value="" />
//               <Picker.Item label="Produce" value="Produce" />
//               <Picker.Item label="Crop Farming" value="Crop Farming" />
//               <Picker.Item label="Livestock Related" value="Livestock Related" />
//             </Picker>

//             {renderSubCategoryPicker()}

//             <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
//             <TextInput style={styles.input} placeholder="Price in KSh" value={price} keyboardType="numeric" onChangeText={setPrice} />
//             <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
//             <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

//             <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
//               {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Submit</Text>}
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
    
//         modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'center',
//         },
//         modalContent: {
//         backgroundColor: '#FFFFFF',
//         margin: 20,
//         borderRadius: 10,
//         padding: 20,
//         elevation: 5,
//         maxHeight: '80%',
//         },
//         modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//         },
//         modalHeaderText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#4CAF50',
//         },
//         closeButton: {
//         padding: 5,
//         },
//         closeButtonText: {
//         fontSize: 28,
//         color: '#666666',
//         fontWeight: 'bold',
//         },
//         input: {
//         backgroundColor: '#FFFFFF',
//         borderWidth: 1,
//         borderColor: '#8BC34A',
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 15,
//         fontSize: 16,
//         },
//         textArea: {
//         height: 100,
//         textAlignVertical: 'top',
//         },
//         submitButton: {
//         backgroundColor: '#4CAF50',
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 10,
//         elevation: 2,
//         },
//         submitButtonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 16,
//         },
      
//     });
  

// export default ProductFormModal;
