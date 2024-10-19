import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: { name: string; quantity: number }[];
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

const initialOrders: Order[] = [
  {
    id: '1',
    date: '2023-05-15',
    total: 35,
    status: 'Delivered',
    items: [
      { name: 'Milk', quantity: 2 },
      { name: 'Eggs', quantity: 1 },
    ],
  },
  {
    id: '2',
    date: '2023-05-18',
    total: 28,
    status: 'Shipped',
    items: [
      { name: 'Cheese', quantity: 1 },
      { name: 'Yogurt', quantity: 2 },
    ],
  },
  {
    id: '3',
    date: '2023-05-20',
    total: 42,
    status: 'Processing',
    items: [
      { name: 'Butter', quantity: 1 },
      { name: 'Cream', quantity: 1 },
      { name: 'Milk', quantity: 2 },
    ],
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return colors.error;
      case 'Shipped': return colors.secondary;
      case 'Delivered': return colors.primary;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => toggleOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
      <View style={styles.orderStatusContainer}>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
        <Ionicons
          name={expandedOrderId === item.id ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.text}
        />
      </View>
      {expandedOrderId === item.id && (
        <View style={styles.orderDetails}>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.orderItemText}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyOrders}>You have no orders</Text>}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 16,
    color: colors.text,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    paddingTop: 10,
  },
  orderItemText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  emptyOrders: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: colors.text,
  },
});

export default Orders;