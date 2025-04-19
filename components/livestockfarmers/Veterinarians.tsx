import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Star } from 'lucide-react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import { Modal } from 'react-native';

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
  gold: '#FFD700',
};

type Veterinarian = {
  vet_name: ReactNode;
  specialty: ReactNode;
  vet_email(vet_email: any): void;
  id: string;
  name: string;
  specialization: string;
  phone_number: string;
  rating: number;
};

const API_BASE_URL = 'https://agrifit-backend-production.up.railway.app';

const Veterinarians = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedVet, setSelectedVet] = useState<Company | null>(null);

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(`${API_BASE_URL}/veterinarians.php`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch veterinarians');
      }
      
      const data: Veterinarian[] = await response.json();
      setVeterinarians(data.map(vet => ({
        ...vet,
        rating: 5 // Setting all ratings to 5 as requested
      })));
      console.log(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleContact = (agency: Veterinarian) => {
    setSelectedVet(agency);
    setModalVisible(true);
  };
  const handleEmail = () => {
    if (selectedVet?.vet_email) {
      Linking.openURL(`mailto:${selectedVet.vet_email}`);
      setModalVisible(false);
    }
  };

  const handleCall = () => {
    if (selectedVet?.phone_number) {
      Linking.openURL(`tel:${selectedVet.phone_number}`);
      setModalVisible(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVet(null);
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={`star-${i}`}  // Use a unique key that doesn't depend on list order
            name={i < rating ? 'star' : 'star-outline'}
            size={12}
            color={i < rating ? colors.gold : colors.text}
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
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
      <Text style={styles.title}>Veterinarians</Text>
      <FlatList
        data={veterinarians}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.vetCard} key={item.id || index.toString()}>
            <Text style={styles.vetName}>{item.vet_name}</Text>
            <Text style={styles.vetSpecialization}>{item.specialty}</Text>
            {renderStars(item.rating)}
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={() => handleContact(item)}
            >
              <Text style={styles.contactButtonText}>Contact</Text>
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
            <Text style={styles.modalTitle}>Contact {selectedVet?.vet_name}</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleEmail}
            >
              <Text style={styles.modalButtonText}>Email {selectedVet?.vet_name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleCall}
            >
              <Text style={styles.modalButtonText}>Call {selectedVet?.vet_name}</Text>
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
  vetCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  vetSpecialization: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.text,
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

export default Veterinarians;