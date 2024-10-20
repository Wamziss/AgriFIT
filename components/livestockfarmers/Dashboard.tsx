import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Livestock = {
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
  lightGray: '#E0E0E0',
};

const livestockListings: Livestock[] = [
  { id: 'l1', name: 'Cow', price: '$800', sellerReview: '4.8/5', imageUrl: '/api/placeholder/100/100' },
  { id: 'l2', name: 'Goat', price: '$200', sellerReview: '4.5/5', imageUrl: '/api/placeholder/100/100' },
  { id: 'l3', name: 'Sheep', price: '$250', sellerReview: '4.7/5', imageUrl: '/api/placeholder/100/100' },
  { id: 'l4', name: 'Chicken', price: '$15', sellerReview: '4.6/5', imageUrl: '/api/placeholder/100/100' },
  { id: 'l5', name: 'Pig', price: '$300', sellerReview: '4.4/5', imageUrl: '/api/placeholder/100/100' },
  { id: 'l6', name: 'Bull', price: '$1000', sellerReview: '4.9/5', imageUrl: '/api/placeholder/100/100' },
];

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filterLivestock = (category: string) => {
    if (category === 'All') {
      return livestockListings;
    }
    return livestockListings.filter(livestock => livestock.name.toLowerCase().includes(category.toLowerCase()));
  };

  const renderLivestockCard = useCallback(({ item }: { item: Livestock }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.livestockImage} />
      <Text style={styles.livestockName}>{item.name}</Text>
      <Text style={styles.livestockPrice}>{item.price}</Text>
      <Text style={styles.sellerReview}>★★★★★  {item.sellerReview}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="cart-outline" size={20} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call-outline" size={15} color={colors.white} />
          <Text style={styles.contactButtonText}>Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {['All', 'Cattle', 'Sheep', 'Goats', 'Chickens', 'Pigs'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryCard,
              selectedCategory === category && styles.activeCategory
            ]}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filterLivestock(selectedCategory)}
        renderItem={renderLivestockCard}
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
    backgroundColor: colors.background,
    padding: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 2,
    minHeight: 'auto'
  },
  categoryCard: {
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: colors.lightGray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 30,
    justifyContent: 'center',
    marginVertical: 5
  },
  activeCategory: {
    backgroundColor: colors.black,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activeCategoryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 8,
    borderRadius: 15,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  livestockImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  livestockName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  livestockPrice: {
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
  iconButton: {
    padding: 5,
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default Dashboard;
