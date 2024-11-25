import React from 'react';
import { FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, refreshing, onRefresh, onDelete, onEdit }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard 
          product={item} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      keyExtractor={(item) => item.product_id.toString()}
      contentContainerStyle={styles.productList}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>No products listed yet</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
    productList: {
        paddingBottom: 20,
        },
      emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666666',
        marginTop: 20,
      },
    });
    
export default ProductList;
  
