import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

type Company = {
  agency_name: ReactNode;
  business_email(business_email: any): void;
  id: string;
  name: string;
  description: string;
  contact: string;
};

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#888888',
  border: '#E0E0E0',
  error: '#FF6B6B',
};

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app';

const Insurance = () => {
  const [insuranceAgencies, setInsuranceAgencies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsuranceAgencies();
  }, []);

  const fetchInsuranceAgencies = async () => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(`${API_BASE_URL}/agencies.php`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch insurance agencies');
      }
      
      const data: Company[] = await response.json();
      setInsuranceAgencies(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleContact = (email: string) => {
    console.log(`Contacting ${email}`);
    // You can implement email linking or other contact functionality here
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insurance Agencies</Text>
      <FlatList
        data={insuranceAgencies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>{item.agency_name}</Text>
            <Text style={styles.companyDescription}>{item.description}</Text>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={() => handleContact(item.business_email as unknown as string)}
            >
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  companyCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  companyDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Insurance;