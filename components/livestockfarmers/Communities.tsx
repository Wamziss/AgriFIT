import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Community = {
  id: string;
  name: string;
  description: string;
  membersCount: number;
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
};

const communitiesData: Community[] = [
  {
    id: '1',
    name: 'Cattle Farmers Society',
    description: 'A community for farmers who keep cattle.',
    membersCount: 125,
  },
  {
    id: '2',
    name: 'Sustainable Livestock Farming Practices',
    description: 'Discuss sustainable farming practices in livestock farming.',
    membersCount: 98,
  },
  {
    id: '3',
    name: 'Livestock Farmers Network',
    description: 'Connect with other farmers to share insights and tips.',
    membersCount: 150,
  },
  {
    id: '4',
    name: 'Young Farmers Association',
    description: 'Join the community of young farmers and share experiences.',
    membersCount: 80,
  },
];

const Communities: React.FC = () => {
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [communities, setCommunities] = useState(communitiesData);

  const handleCreateCommunity = () => {
    const newCommunity: Community = {
      id: `${communities.length + 1}`,
      name: newCommunityName,
      description: newCommunityDescription,
      membersCount: 1, // New community starts with 1 member (the creator)
    };

    setCommunities([...communities, newCommunity]);
    setNewCommunityName('');
    setNewCommunityDescription('');
  };

  const renderCommunity = ({ item }: { item: Community }) => (
    <View style={styles.communityCard}>
      <Text style={styles.communityTitle}>{item.name}</Text>
      <Text style={styles.communityDescription}>{item.description}</Text>
      <Text style={styles.communityMembers}>{item.membersCount} members</Text>
      <TouchableOpacity style={styles.joinButton}>
        <Ionicons name="people-outline" size={16} color={colors.white} />
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Livestock Farming Communities</Text>

      <FlatList
        data={communities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.createCommunityContainer}>
        <Text style={styles.createCommunityTitle}>Create a New Community</Text>
        <TextInput
          value={newCommunityName}
          onChangeText={setNewCommunityName}
          placeholder="Community Name"
          style={styles.input}
        />
        <TextInput
          value={newCommunityDescription}
          onChangeText={setNewCommunityDescription}
          placeholder="Community Description"
          style={styles.input}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCommunity}>
          <Ionicons name="add-outline" size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  communityCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  communityDescription: {
    fontSize: 14,
    color: colors.grey,
    marginVertical: 5,
  },
  communityMembers: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  createCommunityContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  createCommunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default Communities;