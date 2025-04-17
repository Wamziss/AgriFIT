import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios'; 
import { Linking } from 'react-native';

type Product = {
  image: string;
  product_name: ReactNode;
  product_price: ReactNode;
  reviews_avg: ReactNode;
  product_id: string;
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
  black: '#000000'
};

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app/products.php';

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Animal Produce' | 'Crop Produce'>('Animal Produce');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, {
        params: {
          category: 'Produce',
          sub_category: selectedCategory
        }
      });
      
      setProducts(response.data);      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products');
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();  // Reuse the same function
  }, []);

  
  const fetchSellerPhone = async (sellerId: string) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          get_seller_phone: 'true',
          seller_id: sellerId
        }
      });
  
      return response.data.phone_number;
    } catch (error) {
      console.error('Error fetching seller phone:', error);
      return null;
    }
  };
  
  // Modify your handleContactSeller method
  const handleContactSeller = async (sellerId: string) => {
    try {
      // Fetch the seller's phone number
      const phoneNumber = await fetchSellerPhone(sellerId);
  
      if (!phoneNumber) {
        Alert.alert('Contact Error', 'Seller contact information not available');
        return;
      }
  
      Alert.alert(
        'Contact Seller', 
        `Call ${phoneNumber}?`, 
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Call',
            onPress: () => {
              // Use Linking to initiate a phone call
              Linking.openURL(`tel:${phoneNumber}`);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error contacting seller:', error);
      Alert.alert('Error', 'Failed to retrieve seller contact information');
    }
  };

  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image 
        // source={{ uri: item.image || 'default_image_url' }} 
        source={item.image ? { uri: item.image } : undefined}
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productPrice}>KSh {item.product_price}</Text>
      {/* <Text style={styles.sellerReview}>★★★★★  {item.reviews_avg}/5</Text> */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name='cart-outline' size={20} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSeller(item.seller_id as unknown as string)}>
          <Ionicons name='call-outline' size={15} color={colors.white} />
          <Text style={styles.contactButtonText}>Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        {['Animal Produce', 'Crop Produce'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as 'Animal Produce' | 'Crop Produce')}
            style={[
              styles.switchButton,
              selectedCategory === category && styles.activeButton
            ]}
          >
            <Text style={[
              styles.switchButtonText,
              selectedCategory === category && styles.activeButtonText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          // keyExtractor={(item) => item.product_id}
          keyExtractor={(item, index) => {
            if (item.product_id) return `crop-${item.product_id}`;
            
            // Fallback to a combination of index and some unique identifier
            return `crop-${index}-${item.product_name}`;
          }}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <Text>No products found</Text>
          }
          key={selectedCategory}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: colors.black,
  },
  switchButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
  activeButtonText: {
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

