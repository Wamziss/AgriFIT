import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProductFormModal from './ProductForm';


const API_URL = 'http://192.168.100.51/AgriFIT';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productCategory, setProductCategory] = useState(product.category);
  const [subCategory, setSubCategory] = useState(product.sub_category);
  const [name, setName] = useState(product.product_name);
  const [price, setPrice] = useState(product.product_price);
  const [location, setLocation] = useState(product.location);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(product.image ? { uri: `${API_URL}/${product.image}` } : null);
  const [loading, setLoading] = useState(false);

  const handleEditClick = () => {
    setIsModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('product_id', product.product_id);
      formData.append('product_name', name);
      formData.append('product_price', price);
      formData.append('description', description);
      formData.append('category', productCategory);
      formData.append('sub_category', subCategory);
      formData.append('location', location);
  
      if (image && image.uri) {
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
  
        formData.append('image', {
          uri: image.uri,
          type: `image/${fileType}`,
          name: `image_${Date.now()}.${fileType}`,
        });
      }
  
      const response = await fetch(`${API_URL}/editProduct.php`, {
        method: 'POST', // Use POST for multipart data
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const responseData = await response.json(); // Parse JSON response
      console.log('Update Response:', responseData);
  
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to update product');
      }
  
      Alert.alert('Success', 'Product updated successfully');
      setIsModalVisible(false); // Close the modal only on success
      await onEdit(responseData.updatedProduct); // Update the parent list
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => onDelete(product.product_id)
        }
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <Image 
        // source={{ uri: `${API_URL}/${product.image}` }} 
        source={{ uri: image?.uri || `${API_URL}/${product.image}` }}
        style={styles.productImage} 
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productPrice}>KSh {product.product_price}</Text>
        <Text style={styles.productLocation}>{product.location}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteConfirm} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

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
        image={image}
        setImage={setImage}
        loading={loading}
        isEditMode={true}
        productData={product}
      />
    </View>
  );
};

// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import ProductFormModal from './ProductForm';

// const ProductCard = ({ product, onDelete }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [productCategory, setProductCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [location, setLocation] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(product.image); // Manage image state here
//   const [loading, setLoading] = useState(false);

//   // Define the onEdit function
//   const onEdit = (updatedProduct) => {
//     console.log("Updated product:", updatedProduct);
//     // Call your API or update logic here to update the product
//   };

//   // Open the modal and prefill the product data for editing
//   const handleEditClick = () => {
//     setIsModalVisible(true); // This will open the modal
//     setProductCategory(product.category);
//     setSubCategory(product.sub_category);
//     setName(product.product_name);
//     setPrice(product.product_price);
//     setLocation(product.location);
//     setDescription(product.description);
//     setImage(product.image); // Set the product image for editing
//   };

//   // Handle product update submission
//   const handleUpdateProduct = async () => {
//     setLoading(true);
//     try {
//       // Prepare updated product data
//       const updatedProduct = {
//         ...product,
//         category: productCategory,
//         sub_category: subCategory,
//         product_name: name,
//         product_price: price,
//         location,
//         description,
//         image, // Include image in the update
//       };
  
//       // Log the updated product for debugging
//       console.log('Product Updated:', updatedProduct);
  
//       // Call the onEdit function passed from the parent to update the product
//       if (onEdit && typeof onEdit === 'function') {
//         onEdit(updatedProduct);
//       } else {
//         console.error('onEdit is not a valid function');
//       }
  
//       setIsModalVisible(false); // Close the modal after updating
//     } catch (error) {
//       console.error('Error updating product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <View style={styles.cardContainer}>
//       <Image 
//         source={{ uri: `http://192.168.100.51/AgriFIT/${product.image}` }} 
//         style={styles.productImage} 
//       />
//       <View style={styles.productDetails}>
//         <Text style={styles.productName}>{product.product_name}</Text>
//         <Text style={styles.productPrice}>KSh {product.product_price}</Text>
//         <Text style={styles.productLocation}>{product.location}</Text>
//         <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
//       </View>

//       <View style={styles.actions}>
//         <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
//           <Text style={styles.buttonText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onDelete(product.product_id)} style={styles.deleteButton}>
//           <Text style={styles.buttonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ProductFormModal for updating the product */}
//       <ProductFormModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSubmit={handleUpdateProduct}
//         productCategory={productCategory}
//         setProductCategory={setProductCategory}
//         subCategory={subCategory}
//         setSubCategory={setSubCategory}
//         name={name}
//         setName={setName}
//         price={price}
//         setPrice={setPrice}
//         location={location}
//         setLocation={setLocation}
//         description={description}
//         setDescription={setDescription}
//         loading={loading}
//         isEditMode={true} 
//         productData={product} 
//         image={image} // Pass current image
//         setImage={setImage} // Pass setImage to allow updating the image
//         onEdit={onEdit} // Pass the onEdit function
//       />
//     </View>
//   );
// };



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
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    padding: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
  productLocation: {
    fontSize: 14,
    color: 'gray',
  },
  productDescription: {
    fontSize: 14,
  },
  actions: {
    // flexDirection: 'col',
    justifyContent: 'space-between',
    padding: 10,
    // height: 50,
    // alignSelf: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ProductCard;

