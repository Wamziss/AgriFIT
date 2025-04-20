import axios from 'axios';
import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Modal } from 'react-native';

type Company = {
  agency_name: ReactNode;
  business_email(business_email: any): void;
  agency_id: string;
  name: string;
  description: string;
  phone_number: string;
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAgency, setSelectedAgency] = useState<Company | null>(null);

  useEffect(() => {
    fetchInsuranceAgencies();
  }, []);

  const fetchInsuranceAgencies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/agencies.php`, {
        params: {
          category: 'Insurance',
        }
      });
      if (!response.data) {
        throw new Error('Failed to fetch insurance agencies');
      }
      
      setInsuranceAgencies(response.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };
  const handleContact = (agency: Company) => {
    setSelectedAgency(agency);
    setModalVisible(true);
  };

  const handleEmail = () => {
    if (selectedAgency?.business_email) {
      Linking.openURL(`mailto:${selectedAgency.business_email}`);
      setModalVisible(false);
    }
  };

  const handleCall = () => {
    if (selectedAgency?.phone_number) {
      Linking.openURL(`tel:${selectedAgency.phone_number}`);
      setModalVisible(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAgency(null);
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
        keyExtractor={(item) => item.agency_id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>{item.agency_name}</Text>
            <Text style={styles.companyDescription}>{item.description}</Text>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={() => handleContact(item)}
            >
              <Text style={styles.contactButtonText}>Contact Agency</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Contact Modal */}
      <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact {selectedAgency?.agency_name}</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleEmail}
            >
              <Text style={styles.modalButtonText}>Email {selectedAgency?.agency_name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleCall}
            >
              <Text style={styles.modalButtonText}>Call {selectedAgency?.agency_name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>      
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  modalButton: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  modalButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
    width: '50%',
    padding: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Insurance;