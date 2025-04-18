import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  seller_id(seller_id: any): void;
  image: string;
  reviews_avg: ReactNode;
  product_id: string;
  product_price: ReactNode;
  product_name: ReactNode; 
  id: string;
  name: string;
  price: string;
  seller_phone?: string; 
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

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app/products.php';
const CART_API_URL = 'https://agrifit-backend-production.up.railway.app/cart.php';

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [token, setToken] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // Store productId being added

    // Get token on component mount
    useEffect(() => {
      const getToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          setToken(storedToken);
  
        } catch (error) {
          console.error('Error retrieving token:', error);
        }
      };
      
      getToken();
    }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL, {
        params: {
          category: 'Livestock Related',
        }
      });
      
      setProducts(response.data);
      console.log('Fetched products:', response.data);
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

  const filterProducts = (category: string) => {
    if (category === 'All') return products;
      return products.filter(product => 
        typeof product.product_name === 'string' && product.product_name.toLowerCase().includes(category.toLowerCase())
      ) 
  };

  const addToCart = async (productId: string) => {
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to add items to your cart');
      return;
    }

    try {
      setAddingToCart(productId);
      
      const response = await axios.post(
        CART_API_URL,
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success') {
        Alert.alert('Success', 'Item added to cart');
      } else {
        Alert.alert('Error', 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image 
        source={item.image ? { uri: item.image } : undefined} 
        style={styles.livestockImage} 
      />
      <View style={styles.livestockDetails}>
        <Text style={styles.livestockName}>{item.product_name}</Text>
        <Text style={styles.livestockPrice}>KSh {item.product_price}</Text>
        {/* <Text style={styles.sellerReview}>★★★★★  {item.reviews_avg}/5</Text> */}
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={() => addToCart(item.product_id)}
            disabled={addingToCart === item.product_id}
            style={styles.cartButton}
          >
            {addingToCart === item.product_id ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Ionicons name='cart-outline' size={16} color={colors.text} />
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSeller(item.seller_id as unknown as string)}>
        
            <Ionicons name="call-outline" size={15} color={colors.white} />
            <Text style={styles.contactButtonText}>Contact seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [addingToCart]);

  return (
    <View style={styles.container}>
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {['All', 'Cattle', 'Sheep', 'Goats', 'Hens', 'Pigs', 'Horses', 'Rabbits'].map((category) => (
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

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filterProducts(selectedCategory)}
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
        />
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'flex-start'
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 2,
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
    marginVertical: 5,
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
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  livestockImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  livestockDetails: {
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  iconButton: {
    padding: 5,
  },
  cartButton: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginRight: 6,
  },
  cartButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginRight: 6,
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default Dashboard;


