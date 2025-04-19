import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: string;
  quantity: number;
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
  darkGray: '#757575'
};

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app/cart.php';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
        
        if (storedToken) {
          fetchCartItems(storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        setLoading(false);
      }
    };
    
    getToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchCartItems(token);
      }
      return () => {}; // cleanup if needed
    }, [token])
  );

  // Fetch cart items from the API
  const fetchCartItems = async (authToken: string) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      if (response.data.status === 'success') {
        setCartItems(response.data.items);
      } else {
        Alert.alert('Error', 'Failed to load cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    if (token) {
      setRefreshing(true);
      fetchCartItems(token);
    }
  }, [token]);

  // Update item quantity
  const updateQuantity = async (cartId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity would be zero or negative
      removeItem(cartId);
      return;
    }
    
    try {
      const response = await axios.put(
        API_BASE_URL,
        { cart_id: cartId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success') {
        setCartItems(response.data.items);
      } else {
        Alert.alert('Error', 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update cart');
    }
  };

  // Remove item from cart
  const removeItem = async (cartId: string) => {
    try {
      const response = await axios.delete(
        API_BASE_URL,
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: { cart_id: cartId }
        }
      );
      
      if (response.data.status === 'success') {
        setCartItems(response.data.items);
      } else {
        Alert.alert('Error', 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price);
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Render individual cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image 
        source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/user.png')} // Adjust path as needed
        style={styles.itemImage} 
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>KSh {parseFloat(item.price).toFixed(2)}</Text>
      </View>
      
      <View style={styles.rightColumn}>        
        
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity, -1)}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={16} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity, 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => removeItem(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>

      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.lightGray} />
          <Text style={styles.emptyCart}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>
            Add items from the marketplace to see them here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>KSh {getTotalPrice().toFixed(2)}</Text>
            </View>
            
            {/* <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </TouchableOpacity> */}
          </View>
        </>
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    height: 100,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.lightGray,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '40%',
  },
  removeButton: {
    paddingRight: 4,
    alignSelf: 'flex-end',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    // marginTop: 8,
  },
  quantityButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  emptyCart: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: colors.text,
  },
  emptyCartSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: colors.darkGray,
    paddingHorizontal: 40,
  },
  summaryContainer: {
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Cart;