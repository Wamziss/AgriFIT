import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  id: string;
  name: string;
  specialization: string;
  contact: string;
  rating: number;
};

const veterinarians: Veterinarian[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Large Animal Specialist',
    contact: 'sarah.johnson@vetclinic.com',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Poultry Expert',
    contact: 'michael.chen@vetcare.com',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dairy Cattle Specialist',
    contact: 'emily.rodriguez@farmvet.com',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Dr. James Thompson',
    specialization: 'Equine Veterinarian',
    contact: 'james.thompson@horsehealth.com',
    rating: 4.7,
  },
  // Add more veterinarians as needed
];

const Veterinarians = () => {
  const handleContact = (email: string) => {
    console.log(`Contacting ${email}`);
    // You can implement email linking or other contact functionality here
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons name='star' size={16} color={i < fullStars ? colors.gold : (i === fullStars && halfStar ? colors.gold : 'none')} />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veterinarians</Text>

      <FlatList
        data={veterinarians}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.vetCard}>
            <Text style={styles.vetName}>{item.name}</Text>
            <Text style={styles.vetSpecialization}>{item.specialization}</Text>
            {renderStars(item.rating)}
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
    fontSize: 14,
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
});

export default Veterinarians;