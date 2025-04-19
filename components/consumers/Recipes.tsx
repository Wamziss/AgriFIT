import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import WebView from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

type Recipe = {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  description?: string;
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

const Recipes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Blogs' | 'Videos'>('Blogs');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchRecipes = async (query = '') => {
    setIsLoading(true);
    const apiKey = 'AIzaSyD2o-pVOO4d3DfIedgPZ2ihgJBt-9W9v-Q'; 
    const searchEngineId = '26c77dd2a9ae34e4f'; 
    
    let searchQuery = query || 'recipes';
    if (selectedCategory === 'Blogs') {
      searchQuery += 'blog';
    } else {
      searchQuery += 'tutorial';
    }
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&cx=${searchEngineId}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${data.error?.message || 'Unknown error'}`);
      }
      
      if (!data.items) {
        throw new Error('No items found in the API response');
      }
      
      const formattedRecipes = data.items.map((item: any) => ({
        id: item.cacheId || item.link,
        title: item.title,
        thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || 
                  item.pagemap?.cse_image?.[0]?.src || 
                  'https://via.placeholder.com/100?text=Recipe',
        link: item.link,
        description: item.snippet,
      }));
      setRecipes(formattedRecipes);
    } catch (error) {
      console.log('Error fetching recipes: ', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      fetchRecipes();
    }
  }, [selectedCategory, isSearching]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      fetchRecipes(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
    setWebViewLoading(true);
    setWebViewError(false);
  };

  const handleWebViewLoad = () => {
    setWebViewLoading(false);
  };

  const handleWebViewError = () => {
    setWebViewLoading(false);
    setWebViewError(true);
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => openRecipeModal(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
            <View style={styles.switchContainer}>
        {['Blogs', 'Videos'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => {
              setSelectedCategory(category as 'Blogs' | 'Videos');
              setIsSearching(false);
            }}
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

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes (e.g., 'things to make with milk')"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color='#aaa' />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={handleSearch}
        >
          <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>



      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding delicious recipes...</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="nutrition-outline" size={50} color={colors.secondary} />
              <Text style={styles.emptyText}>No recipes found</Text>
              <Text style={styles.emptySubText}>Try a different search term or category</Text>
            </View>
          }
        />
      )}

      {/* Modal for displaying recipes */}
      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        transparent={false}
        onRequestClose={closeRecipeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedRecipe?.title}
            </Text>
            <TouchableOpacity onPress={closeRecipeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {selectedRecipe && (
            <View style={styles.webviewContainer}>
              {webViewLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Loading recipe...</Text>
                </View>
              )}
              {webViewError && (
                <View style={styles.errorOverlay}>
                  <Ionicons name="warning" size={50} color={colors.secondary} />
                  <Text style={styles.errorText}>Recipe not found</Text>
                  <TouchableOpacity 
                    onPress={closeRecipeModal} 
                    style={styles.errorButton}
                  >
                    <Text style={styles.errorButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
              <WebView
                source={{ uri: selectedRecipe.link }}
                style={[
                  styles.webview, 
                  (webViewLoading || webViewError) && { opacity: 0 }
                ]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoad={handleWebViewLoad}
                onError={handleWebViewError}
                startInLoadingState={true}
                renderLoading={() => <View />}
              />
            </View>
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    width: '85%',
    alignSelf: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
  },
  clearButton: {
    padding: 5,
  }, 
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 4,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: colors.text,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: colors.text,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: colors.white,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginVertical: 20,
  },
  errorButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  errorButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Recipes;