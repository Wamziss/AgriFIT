import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image, StyleSheet } from 'react-native';
import { Plus, X, Camera } from 'lucide-react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#FF6B6B',
  black: '#000000',
  gray: '#E0E0E0',
};

type Livestock = {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  imageUrl: string;
};

const initialLivestock: Livestock[] = [
  {
    id: '1',
    name: 'Bessie',
    breed: 'Holstein',
    age: '4 years',
    weight: '1200 lbs',
    imageUrl: '/api/placeholder/150/150',
  },
  {
    id: '2',
    name: 'Spot',
    breed: 'Angus',
    age: '2 years',
    weight: '900 lbs',
    imageUrl: '/api/placeholder/150/150',
  },
];

const LivestockProfiles: React.FC = () => {
  const [livestock, setLivestock] = useState<Livestock[]>(initialLivestock);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLivestock, setNewLivestock] = useState<Partial<Livestock>>({});

  const addLivestock = () => {
    if (newLivestock.name && newLivestock.breed && newLivestock.age && newLivestock.weight) {
      setLivestock([
        ...livestock,
        {
          id: Date.now().toString(),
          imageUrl: '/api/placeholder/150/150',
          ...newLivestock as Livestock,
        },
      ]);
      setNewLivestock({});
      setModalVisible(false);
    }
  };

  const renderLivestockItem = ({ item }: { item: Livestock }) => (
    <View style={styles.livestockCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.livestockImage} />
      <View style={styles.livestockInfo}>
        <Text style={styles.livestockName}>{item.name}</Text>
        <Text style={styles.livestockDetail}>Breed: {item.breed}</Text>
        <Text style={styles.livestockDetail}>Age: {item.age}</Text>
        <Text style={styles.livestockDetail}>Weight: {item.weight}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Livestock Profiles</Text>
      <FlatList
        data={livestock}
        renderItem={renderLivestockItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        {/* <Plus color={colors.white} size={24} /> */}
        <Ionicons name="add-circle" size={24} color={colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              {/* <X color={colors.text} size={24} /> */}
              <Ionicons name="close-circle" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Livestock</Text>

            <TouchableOpacity style={styles.imageUpload}>
              <Ionicons name="image" size={40} color={colors.primary} />
              <Text style={styles.imageUploadText}>Upload Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newLivestock.name}
              onChangeText={(text) => setNewLivestock({ ...newLivestock, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={newLivestock.breed}
              onChangeText={(text) => setNewLivestock({ ...newLivestock, breed: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={newLivestock.age}
              onChangeText={(text) => setNewLivestock({ ...newLivestock, age: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              value={newLivestock.weight}
              onChangeText={(text) => setNewLivestock({ ...newLivestock, weight: text })}
            />

            <TouchableOpacity style={styles.addButtonModal} onPress={addLivestock}>
              <Text style={styles.addButtonText}>Add Livestock</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  livestockCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  livestockImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  livestockInfo: {
    flex: 1,
  },
  livestockName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  livestockDetail: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  imageUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    height: 120,
    marginBottom: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray,
  },
  imageUploadText: {
    color: colors.text,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  addButtonModal: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LivestockProfiles;