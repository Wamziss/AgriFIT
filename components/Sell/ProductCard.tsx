import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProductFormModal from './ProductForm';

const ProductCard = ({ product, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(
    product.image 
      ? { uri: `http://192.168.100.51/AgriFIT/${product.image}` } 
      : null
  );

  // Open the modal and prefill the product data for editing
  const handleEditClick = () => {
    setIsModalVisible(true);
    setProductCategory(product.category);
    setSubCategory(product.sub_category);
    setName(product.product_name);  // Changed from 'name' to 'product_name'
    setPrice(product.product_price.toString()); 
    setLocation(product.location);
    setDescription(product.description);

    if (product.image) {
      setImage({ 
        uri: `http://192.168.100.51/AgriFIT/${product.image}` 
      });
    }
  };

  // Handle product update submission
  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      // Perform the update operation here (API call or state update)
      // After successful update, close the modal
      console.log('Product Updated:', {
        productCategory,
        subCategory,
        name,
        price,
        location,
        description,
      });
      setIsModalVisible(false); // Close the modal after updating
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image 
        source={product.image ? { uri: `http://192.168.100.51/AgriFIT/${product.image}` } : undefined}
        style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>KSh {product.product_price}</Text>
        <Text style={styles.productLocation}>{product.location}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(product.product_id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* ProductFormModal for updating the product */}
      <ProductFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleUpdateProduct}
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
        loading={loading}
        isEditMode={true} // Pass true for edit mode
        productData={product} // Pass the product data to pre-fill the fields
        image={image}  // Use the image state from ProductCard
        setImage={setImage} 
        />
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  productPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginVertical: 5,
  },
  productLocation: {
    fontSize: 14,
    color: '#777777',
  },
  productDescription: {
    fontSize: 12,
    color: '#555555',
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ProductCard;


function setImage(arg0: { uri: string; }) {
  throw new Error('Function not implemented.');
}

