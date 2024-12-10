import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import axios from 'axios';  
import { Linking } from 'react-native';

type Product = {   
  image: string;   
  reviews_avg: string;   
  product_id: string;   
  product_price: string;   
  product_name: string;   
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

const API_BASE_URL = 'http://192.168.100.51/AgriFIT/products.php';  

const Dashboard: React.FC = () => {   
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);   
  const [loading, setLoading] = useState(true);    

  useEffect(() => {     
    fetchProducts();   
  }, []);    

  const fetchProducts = async () => {     
    try {       
      setLoading(true);       
      const response = await axios.get(API_BASE_URL, {         
        params: {           
          category: 'Crop Farming'         
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
        source={item.image ? { uri: `http://192.168.100.51/AgriFIT/${item.image}` } : undefined}          
        style={styles.productImage}        
      />       
      <Text style={styles.productName}>{item.product_name}</Text>       
      <Text style={styles.productPrice}>KSh {item.product_price}</Text>       
      {/* <Text style={styles.sellerReview}>★★★★★  {item.reviews_avg}/5</Text>        */}
      <View style={styles.actions}>         
        <TouchableOpacity>           
          <Ionicons name='cart-outline' size={20} color={colors.black} />         
        </TouchableOpacity>         
        <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSeller(item.seller_id)}>           
          <Ionicons name='call-outline' size={15} color={colors.white} />           
          <Text style={styles.contactButtonText}>Seller</Text>         
        </TouchableOpacity>       
      </View>     
    </View>   
  ), []);    

  return (     
    <View style={styles.container}>       
      {loading ? (         
        <Text>Loading...</Text>       
      ) : (         
        <FlatList           
          data={products}           
          renderItem={renderProductCard}           
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


