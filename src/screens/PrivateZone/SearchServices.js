import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import algoliasearch from 'algoliasearch/lite';

const SearchServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Configurar Algolia
  const ALGOLIA_APP_ID = 'VSO7VMX0UE';
  const ALGOLIA_API_KEY = '262fe5ea97e94bf5e4a9460e2846fba1';
  const ALGOLIA_INDEX_NAME = 'serviceSearchIndex'; // Nombre del índice de Algolia

  const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  const algoliaIndex = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);

  const fetchServices = async term => {
    try {
      setLoading(true);
      console.log(term);
      // Realizar búsqueda en Algolia
      const algoliaResponse = await algoliaIndex.search(term);
      // Obtener los datos de los resultados

      setServices(algoliaResponse.hits);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      // Debounce the search execution using a timeout
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        fetchServices(searchTerm);
      }, 1500);
    } else {
      // Clear the search results if the search term is less than 3 characters
      setServices([]);
    }
  }, [searchTerm]);

  const renderItem = ({item}) => (
    <Text style={styles.serviceItem}>
      {item.serviceEnglish} / {item.serviceSpanish}
    </Text>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar servicios..."
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={item => item.objectID.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  serviceItem: {
    fontSize: 18,
    marginBottom: 5,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default SearchServices;
