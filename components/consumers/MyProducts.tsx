import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  status: 'Active' | 'Sold' | 'Inactive';
  description?: string;
  category?: string;
};

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000'
};

const initialProducts: Product[] = [
  { id: '1', name: 'Fresh Milk', price: 3, imageUrl: '/api/placeholder/80/80', status: 'Active' },
  { id: '2', name: 'Organic Eggs', price: 4, imageUrl: '/api/placeholder/80/80', status: 'Sold' },
  { id: '3', name: 'Homemade Cheese', price: 6, imageUrl: '/api/placeholder/80/80', status: 'Inactive' },
];

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  const handleEdit = (productId: string) => {
    const productToEdit = products.find(p => p.id === productId);
    if (productToEdit) {
      setNewProduct(productToEdit);
      setModalVisible(true);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleAddNewProduct = () => {
    setNewProduct({});
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (newProduct.id) {
      // Edit existing product
      setProducts(products.map(p => p.id === newProduct.id ? { ...p, ...newProduct } : p));
    } else {
      // Add new product
      const productToAdd = {
        ...newProduct,
        id: Date.now().toString(),
        status: 'Active' as const,
        imageUrl: '/api/placeholder/80/80', // placeholder image
      };
      setProducts([...products, productToAdd as Product]);
    }
    setModalVisible(false);
    setNewProduct({});
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'Active': return colors.primary;
      case 'Sold': return colors.secondary;
      case 'Inactive': return colors.error;
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={[styles.productStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Products</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyList}>You haven't listed any products yet</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewProduct}>
        <Ionicons name="add" size={24} color={colors.white} />
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalTitle}>
                {newProduct.id ? 'Edit Product' : 'Add New Product'}
              </Text>

              <TouchableOpacity style={styles.imageUpload}>
                <Ionicons name="camera-outline" size={50} color={colors.primary} />
                <Text style={styles.imageUploadText}>Tap to add product images</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Price"
                value={newProduct.price?.toString()}
                onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || 0 })}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={newProduct.description}
                onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                multiline
                numberOfLines={4}
              />

              <TextInput
                style={styles.input}
                placeholder="Category"
                value={newProduct.category}
                onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                  {newProduct.id ? 'Update Product' : 'Add Product'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  productPrice: {
    fontSize: 14,
    color: colors.primary,
  },
  productStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
  emptyList: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 35,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalScrollView: {
    width: '100%',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  imageUpload: {
    height: 150,
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadText: {
    marginTop: 10,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'lightgray',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MyProducts;