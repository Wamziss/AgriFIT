import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';

type Resource = {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
};

const colors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  background: '#F1F8E9',
  white: '#FFFFFF',
  black: '#000000',
};

const CareGuides: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Blogs' | 'Books' | 'Videos'>('Blogs');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      const apiKey = 'AIzaSyD2o-pVOO4d3DfIedgPZ2ihgJBt-9W9v-Q'; // Replace with your actual API key
      const searchEngineId = '26c77dd2a9ae34e4f'; // Replace with your actual Search Engine ID
      // const searchEngineId = '104929788023451831670'; // Replace with your actual Search Engine ID
      let resourceType = '';
      switch (selectedCategory) {
        case 'Blogs':
          resourceType = 'blog';
          break;
        case 'Books':
          resourceType = 'book';
          break;
        case 'Videos':
          resourceType = 'video';
          break;
      }
      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?q=livestock+care+${resourceType}&key=${apiKey}&cx=${searchEngineId}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}: ${data.error?.message || 'Unknown error'}`);
        }
        
        if (!data.items) {
          throw new Error('No items found in the API response');
        }
        
        const formattedResources = data.items.map((item: any) => ({
          id: item.cacheId || item.link,
          title: item.title,
          thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || 'https://via.placeholder.com/100',
          link: item.link,
        }));
        setResources(formattedResources);
      } catch (error) {
        console.error('Error fetching resources: ', error);
        // Alert.alert('Error', `Failed to fetch resources: ${error.message}`);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [selectedCategory]);

  const renderResourceCard = ({ item }: { item: Resource }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log(`Viewing ${item.title}`)}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        {['Blogs', 'Books', 'Videos'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category as 'Blogs' | 'Books' | 'Videos')}
            style={[
              styles.switchButton,
              selectedCategory === category && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.switchButtonText,
                selectedCategory === category && styles.activeButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={resources}
          renderItem={renderResourceCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No resources found</Text>}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 4,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: colors.black,
  },
  switchButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
  activeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 8,
    borderRadius: 10,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CareGuides;