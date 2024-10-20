import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Product = {
  id: string;
  name: string;
  price: string;
  sellerReview: string;
  imageUrl: string;
};

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
};

// Mock data for crop farmers' products (seedlings, etc.)
const seedlingProducts: Product[] = [
  { id: 's1', name: 'Tomato Seedlings', price: '$5', sellerReview: '4.8/5', imageUrl: '/api/placeholder/100/100' },
  { id: 's2', name: 'Maize Seedlings', price: '$4', sellerReview: '4.7/5', imageUrl: '/api/placeholder/100/100' },
  { id: 's3', name: 'Lettuce Seedlings', price: '$3.5', sellerReview: '4.6/5', imageUrl: '/api/placeholder/100/100' },
  { id: 's4', name: 'Potato Seedlings', price: '$6', sellerReview: '4.5/5', imageUrl: '/api/placeholder/100/100' },
  { id: 's5', name: 'Onion Seedlings', price: '$2.5', sellerReview: '4.9/5', imageUrl: '/api/placeholder/100/100' },
  { id: 's6', name: 'Cabbage Seedlings', price: '$3', sellerReview: '4.7/5', imageUrl: '/api/placeholder/100/100' },
];

const Dashboard: React.FC = () => {
  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <Text style={styles.sellerReview}>★★★★★  {item.sellerReview}</Text>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name='cart-outline' size={20} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name='call-outline' size={15} color={colors.white} />
          <Text style={styles.contactButtonText}>Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={seedlingProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5,
  },
  sellerReview: {
    fontSize: 14,
    color: '#FFA000',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default Dashboard;
