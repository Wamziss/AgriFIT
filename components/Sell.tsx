// SellProductsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ProductFormModal from './Sell/ProductForm';
import ProductList from './Sell/ProductsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';

const API_URL = 'http://192.168.100.51/AgriFIT';

const SellProductsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const sellerId = await AsyncStorage.getItem('sellerId');
      
      const response = await fetch(`${API_URL}/products.php?seller_id=${sellerId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products.php?product_id=${productId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        Alert.alert('Success', 'Product deleted successfully');
        // Update local state to remove the deleted product
        setProducts(prevProducts => prevProducts.filter(product => product.product_id !== productId));
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = async (updatedProduct) => {
    try {
      const formData = new FormData();
  
      // Append all product details
      Object.keys(updatedProduct).forEach(key => {
        if (key === 'image' && updatedProduct[key] && 'uri' in updatedProduct[key]) {
          // Convert image URI to a file
          const imageObject = updatedProduct[key];
          const uriParts = imageObject.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          
          formData.append('image', {
            uri: imageObject.uri,
            type: `image/${fileType}`,
            name: `photo_${Date.now()}.${fileType}`,
          } as any);
        } else {
          formData.append(key, updatedProduct[key]);
        }
      });      

      const response = await fetch(`${API_URL}/products.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        Alert.alert('Success', 'Product updated successfully');
        fetchProducts(); // Refresh product list
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update product: ${error.message}`);
      console.error('Error updating product:', error);
    }
  };
  // const [modalVisible, setModalVisible] = useState(false);
  // const [productCategory, setProductCategory] = useState('');
  // const [subCategory, setSubCategory] = useState('');
  // const [name, setName] = useState('');
  // const [price, setPrice] = useState('');
  // const [description, setDescription] = useState('');
  // const [location, setLocation] = useState('');
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  // const [image, setImage] = useState<{ uri: string } | null>(null);

  // // Fetch products when component mounts
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const sellerId = await AsyncStorage.getItem('sellerId');
      
  //     const response = await fetch(`${API_URL}/products.php?seller_id=${sellerId}`);
  //     if (!response.ok) throw new Error('Network response was not ok');
      
  //     const data = await response.json();
  //     setProducts(data);
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to fetch products');
  //     console.error('Error fetching products:', error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  // const handleDelete = async (productId) => {
  //   try {
  //     const response = await fetch(`${API_URL}/products.php?product_id=${productId}`, {
  //       method: 'DELETE',
  //     });

  //     const result = await response.json();
      
  //     if (result.success) {
  //       Alert.alert('Success', 'Product deleted successfully');
  //       // Update local state to remove the deleted product
  //       setProducts(prevProducts => prevProducts.filter(product => product.product_id !== productId));
  //     } else {
  //       throw new Error(result.message || 'Failed to delete product');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to delete product');
  //     console.error('Error deleting product:', error);
  //   }
  // };

  // const handleEdit = async (updatedProduct: { [x: string]: string | Blob; }) => {
  //   try {
  //     const formData = new FormData();
  
  //     // Append all product details
  //     Object.keys(updatedProduct).forEach(key => {
  //       if (key === 'image' && typeof updatedProduct[key] === 'object' && 'uri' in updatedProduct[key]) {
  //         // Convert image URI to a file
  //         const imageObject = updatedProduct[key] as { uri: string };

  //         const uriParts = imageObject.uri.split('.');
  //         const fileType = uriParts[uriParts.length - 1];
          
  //         formData.append('image', {
  //           uri: imageObject.uri,
  //           type: `image/${fileType}`,
  //           name: `photo_${Date.now()}.${fileType}`,
  //         } as any);
  //       } else {
  //         formData.append(key, updatedProduct[key] as string);
  //       }
  //     });      

  //     const response = await fetch(`${API_URL}/products.php`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: formData,
  //     });
  
  //     const result = await response.json();
  
  //     if (result.success) {
  //       Alert.alert('Success', 'Product updated successfully');
  //       fetchProducts(); // Refresh product list
  //     } else {
  //       throw new Error(result.message || 'Failed to update product');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', `Failed to update product: ${error.message}`);
  //     console.error('Error updating product:', error);
  //   }
  // };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!image?.uri) {
        Alert.alert('Error', 'Please select an image');
        return;
      }

      const sellerId = await AsyncStorage.getItem('sellerId');
      console.log('Seller ID:', sellerId);
      const formData = new FormData();
      
      formData.append('seller_id', sellerId ?? '0');
      formData.append('product_name', name);
      formData.append('product_price', price);
      formData.append('description', description);
      formData.append('category', productCategory);
      formData.append('sub_category', subCategory || '');
      formData.append('location', location);

      if (image?.uri) {
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: image.uri,
          type: `image/${fileType}`,
          name: `photo_${Date.now()}.${fileType}`,
        });
      }

      const response = await fetch(`${API_URL}/products.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      console.log('Response:', response);

      const result = await response.json();
      console.log('Response from API:', result);
      
      if (result.status === 'success') {
        Alert.alert('Success', 'Product added successfully!');
        resetForm();
        fetchProducts();
      } else {
        throw new Error(result.message || 'Failed to add product');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductCategory('');
    setSubCategory('');
    setName('');
    setPrice('');
    setDescription('');
    setLocation('');
    setImage(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ ADD PRODUCT</Text>
      </TouchableOpacity>

      <ProductList
        products={products}
        loading={loading}
        refreshing={refreshing}
        onRefresh={fetchProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ProductFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        productCategory={productCategory}
        setProductCategory={setProductCategory}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        location={location}
        setLocation={setLocation}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        loading={loading}
        isEditMode={false}
        productData={null}
      />
    </View>
  );
};
  
export default SellProductsScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
//   ScrollView,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://192.168.100.51/AgriFIT'; 

// const SellProductsScreen = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [productCategory, setProductCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const sellerId = await AsyncStorage.getItem('sellerId'); // Get seller ID from storage
      
//       const response = await fetch(`${API_URL}/products.php`);
//       console.log(response)
//       if (!response.ok) throw new Error('Network response was not ok');
      
//       const data = await response.json();
//       // Filter products for current seller
//       console.log(data);
//       const sellerProducts = data.filter(product => product.seller_id === sellerId);
//       setProducts(sellerProducts);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch products');
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

  // const handleSubmit = async () => {
  //   if (!productCategory || !name || !price || !description || !location) {
  //     Alert.alert('Error', 'Please fill all required fields.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const sellerId = await AsyncStorage.getItem('sellerId'); // Get seller ID from storage
      
  //     const formData = new FormData();
  //     formData.append('seller_id', sellerId ?? '0'); 
  //     formData.append('product_name', name);
  //     formData.append('product_price', price);
  //     formData.append('description', description);
  //     formData.append('category', productCategory);
  //     formData.append('sub_category', subCategory);
  //     formData.append('location', location);

  //     const response = await fetch(`${API_URL}/products.php`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error('Network response was not ok');
      
  //     const result = await response.text();
  //     console.log('Server response:', result);

  //     Alert.alert('Success', 'Product added successfully!');
  //     resetForm();
  //     setModalVisible(false);
  //     fetchProducts(); // Refresh the products list
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to add product');
  //     console.error('Error adding product:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const handleEdit = async (productId) => {
//     try {
//       const formData = new FormData();
//       formData.append('product_id', productId);
//       formData.append('product_name', name);
//       formData.append('product_price', price);
//       formData.append('description', description);
//       formData.append('category', productCategory);
//       formData.append('sub_category', subCategory);
//       formData.append('location', location);

//       const response = await fetch(`${API_URL}/products.php`, {
//         method: 'PUT',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Network response was not ok');
      
//       Alert.alert('Success', 'Product updated successfully!');
//       fetchProducts(); // Refresh the products list
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update product');
//       console.error('Error updating product:', error);
//     }
//   };

//   const handleDelete = async (productId) => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this product?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const formData = new FormData();
//               formData.append('product_id', productId);

//               const response = await fetch(`${API_URL}/products.php`, {
//                 method: 'DELETE',
//                 body: formData,
//               });

//               if (!response.ok) throw new Error('Network response was not ok');
              
//               Alert.alert('Success', 'Product deleted successfully!');
//               fetchProducts(); // Refresh the products list
//             } catch (error) {
//               Alert.alert('Error', 'Failed to delete product');
//               console.error('Error deleting product:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const resetForm = () => {
//     setProductCategory('');
//     setSubCategory('');
//     setName('');
//     setPrice('');
//     setDescription('');
//     setLocation('');
//   };

//   const renderSubCategoryPicker = () => {
//     if (productCategory === 'Produce') {
//       return (
//         <Picker
//           selectedValue={subCategory}
//           onValueChange={(value) => setSubCategory(value)}
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
//           onValueChange={(value) => setSubCategory(value)}
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

//   const renderProductItem = ({ item }) => (
//     <View style={styles.productCard}>
//       <View style={styles.productInfo}>
//         <Text style={styles.productName}>{item.product_name}</Text>
//         <Text style={styles.productCategory}>
//           {item.category} {item.sub_category ? `- ${item.sub_category}` : ''}
//         </Text>
//         <Text style={styles.productPrice}>KSh {item.product_price}</Text>
//         <Text style={styles.productDescription}>{item.description}</Text>
//         <Text style={styles.productLocation}>Location: {item.location}</Text>
//         <Text style={styles.productDate}>Listed on: {new Date(item.created_at).toLocaleDateString()}</Text>
//       </View>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.editButton]}
//           onPress={() => handleEdit(item.product_id)}
//         >
//           <Text style={styles.actionButtonText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.deleteButton]}
//           onPress={() => handleDelete(item.product_id)}
//         >
//           <Text style={styles.actionButtonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity 
//         style={styles.addButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.addButtonText}>+ ADD PRODUCT</Text>
//       </TouchableOpacity>

//       {/* Products List */}
//       <Text style={styles.listHeader}>Your Listed Products</Text>
      
//       {loading && !refreshing ? (
//         <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
//       ) : (
//         <FlatList
//           data={products}
//           renderItem={renderProductItem}
//           keyExtractor={(item) => item.product_id.toString()}
//           contentContainerStyle={styles.productList}
//           showsVerticalScrollIndicator={false}
//           refreshing={refreshing}
//           onRefresh={() => {
//             setRefreshing(true);
//             fetchProducts();
//           }}
//           ListEmptyComponent={() => (
//             <Text style={styles.emptyText}>No products listed yet</Text>
//           )}
//         />
//       )}

//       {/* Add Product Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalHeaderText}>Add New Product</Text>
//                 <TouchableOpacity 
//                   style={styles.closeButton}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={styles.closeButtonText}>×</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Form fields */}
//               <Picker
//                 selectedValue={productCategory}
//                 onValueChange={(value) => {
//                   setProductCategory(value);
//                   setSubCategory('');
//                 }}
//                 style={styles.input}
//               >
//                 <Picker.Item label="Select Product Category" value="" />
//                 <Picker.Item label="Produce" value="Produce" />
//                 <Picker.Item label="Crop Farming" value="Crop Farming" />
//                 <Picker.Item label="Livestock Related" value="Livestock Related" />
//               </Picker>

//               {renderSubCategoryPicker()}

//               <TextInput
//                 style={styles.input}
//                 placeholder="Product Name"
//                 value={name}
//                 onChangeText={setName}
//               />

//               <TextInput
//                 style={styles.input}
//                 placeholder="Price in KSh"
//                 value={price}
//                 keyboardType="numeric"
//                 onChangeText={setPrice}
//               />

//               <TextInput
//                 style={styles.input}
//                 placeholder="Location"
//                 value={location}
//                 onChangeText={setLocation}
//               />

//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Description"
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline
//               />

//               <TouchableOpacity 
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Submit</Text>
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 20,
    },
    addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    },
    addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    },
    listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    },
    productList: {
    paddingBottom: 20,
    },
    productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    },
    productInfo: {
    flex: 1,
    },
    productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
    },
    productCategory: {
    fontSize: 14,
    color: '#689F38',
    marginBottom: 5,
    },
    productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
    },
    productDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
    },
    productDate: {
    fontSize: 12,
    color: '#999999',
    },
    editButton: {
    backgroundColor: '#8BC34A',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    },
    editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    },
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
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    width: 70,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
});

// export default SellProductsScreen;


