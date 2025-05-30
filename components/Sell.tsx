// SellProductsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ProductFormModal from './Sell/ProductForm';
import ProductList from './Sell/ProductsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';

const API_URL = 'https://agrifit-backend-production.up.railway.app';

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

  const handleDelete = async (productId: any) => {
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


  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!image?.uri) {
        Alert.alert('Error', 'Please select an image');
        return;
      }

      const sellerId = await AsyncStorage.getItem('sellerId');
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

      const text = await response.text();

      const result = JSON.parse(text); 
      console.log('Parsed result:', result);
      
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

export default SellProductsScreen;


