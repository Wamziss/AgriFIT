import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product }) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productCategory}>
          {product.category} {product.sub_category ? `- ${product.sub_category}` : ''}
        </Text>
        <Text style={styles.productPrice}>KSh {product.product_price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productLocation}>Location: {product.location}</Text>
        <Text style={styles.productDate}>Listed on: {new Date(product.created_at).toLocaleDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({   
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
  

export default ProductCard;
