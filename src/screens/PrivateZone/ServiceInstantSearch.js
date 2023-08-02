import {StyleSheet, Text, SafeAreaView} from 'react-native';
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, Hits} from 'react-instantsearch-native';
import SearchBox from '../../components/SearchBox';
import InfiniteHits from '../../components/InfiniteHits';

const ServiceInstantSearch = () => {
  const ALGOLIA_APP_ID = 'VSO7VMX0UE';
  const ALGOLIA_API_KEY = '262fe5ea97e94bf5e4a9460e2846fba1';
  const ALGOLIA_INDEX_NAME = 'serviceSearchIndex'; // Nombre del índice de Algolia

  const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <InstantSearch
        style={styles.instantSearchStyle}
        indexName={ALGOLIA_INDEX_NAME}
        searchClient={algoliaClient}>
        <SearchBox />
        <InfiniteHits style={styles.infiniteHits} />
      </InstantSearch>
    </SafeAreaView>
  );
};

export default ServiceInstantSearch;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  instantSearchStyle: {
    backgroundColor: 'green',
  },
  infiniteHits: {
    backgroundColor: 'green',
    fontFamily: 'Times',
    fontSize: 24,
    height: 500,
  },
});
