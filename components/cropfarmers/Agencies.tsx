import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
};

type Company = {
  id: string;
  name: string;
  description: string;
  contact: string;
};

const agritechCompanies: Company[] = [
  {
    id: '1',
    name: 'AgroTech Solutions',
    description: 'Providing smart farming technologies for optimized crop management.',
    contact: 'agrotech@solutions.com',
  },
  {
    id: '2',
    name: 'GreenGrow Technologies',
    description: 'Innovative greenhouse solutions to enhance crop yields.',
    contact: 'greengrow@tech.com',
  },
  {
    id: '3',
    name: 'FarmEase Technologies',
    description: 'Revolutionizing rural agriculture through AI-powered analytics.',
    contact: 'farmease@tech.com',
  },
  // Add more companies as needed
];

const Agencies = () => {
  const handleContact = (email: string) => {
    console.log(`Contacting ${email}`);
    // You can implement email linking or other contact functionality here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AgriTech Companies</Text>

      <FlatList
        data={agritechCompanies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>{item.name}</Text>
            <Text style={styles.companyDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact(item.contact)}
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

export default Agencies;
