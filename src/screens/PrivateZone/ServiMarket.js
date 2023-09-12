import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch} from 'react-instantsearch-native';
import SearchBox from '../../components/SearchBox';
import PropTypes from 'prop-types';
import {connectInfiniteHits} from 'react-instantsearch-native';
import {connectHighlight} from 'react-instantsearch-native';

const ServiMarket = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await firestore()
          .collection('serviceCategories')
          .get();
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data());
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  );

  const preInfiniteHits = ({hits, hasMore, refineNext}) => {
    //console.log(hits);
    return (
      <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => hasMore && refineNext()}
        renderItem={renderServiceItem}
        //numColumns={2}
      />
    );
  };

  preInfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
  };

  const InfiniteHits = connectInfiniteHits(preInfiniteHits);

  const preHighlight = ({attribute, hit, highlight}) => {
    const highlights = highlight({
      highlightProperty: '_highlightResult',
      attribute,
      hit,
    });

    return (
      <Text>
        {highlights.map(({value, isHighlighted}, index) => {
          const style = {
            color: isHighlighted ? 'black' : 'white',
            backgroundColor: isHighlighted ? 'yellow' : 'transparent',
          };
          return (
            <Text key={index} style={style}>
              {value}
            </Text>
          );
        })}
      </Text>
    );
  };

  preHighlight.propTypes = {
    attribute: PropTypes.string.isRequired,
    hit: PropTypes.object.isRequired,
    highlight: PropTypes.func.isRequired,
  };

  const Highlight = connectHighlight(preHighlight);

  const renderServiceItem = ({item}) => {
    const parsedServiceCategoryId = parseInt(
      item.serviceCategory.split('/')[1],
      10,
    );
    const serviceCategory = categories.find(
      category => category.serviceCategoryId === parsedServiceCategoryId,
    );

    if (!serviceCategory) {
      return (
        <View style={styles.serviceItemContainer}>
          <Image source={{uri: item.imageUrl}} style={styles.serviceImage} />
          <View style={styles.overlay} />
          <View style={styles.serviceTextContainer}>
            <Text style={styles.serviceText}>Service Name...</Text>
            <Text style={styles.serviceText}>Nombre de Servicio...</Text>
          </View>
          {item.serviceCategory && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>Category...</Text>
              <Text style={styles.categoryText}>Categoría</Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.serviceItemContainer}>
          <Image source={{uri: item.imageUrl}} style={styles.serviceImage} />
          <View style={styles.overlay} />
          <View style={styles.serviceTextContainer}>
            <Text style={styles.serviceText}>
              <Highlight attribute="serviceEnglish" hit={item} />
            </Text>
            <Text style={styles.serviceText}>
              <Highlight attribute="serviceSpanish" hit={item} />
            </Text>
          </View>
          {item.serviceCategory && (
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>
                {serviceCategory.serviceCategoryEnglish}
              </Text>
              <Text style={styles.categoryText}>
                {serviceCategory.serviceCategorySpanish}
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <Text style={styles.searchTitle}>I'm looking for...</Text>
      <InstantSearch
        style={styles.instantSearchStyle}
        indexName={process.env.ALGOLIA_INDEX_NAME}
        searchClient={algoliaClient}>
        <SearchBox />
        <InfiniteHits style={styles.infiniteHits} />
      </InstantSearch>
    </SafeAreaView>
  );
};

export default ServiMarket;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceItemContainer: {
    //position: 'relative',
    //flexDirection: 'column',
    //alignItems: 'center',
    //marginRight: 10,
    //width:'100%',
    height: 200,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  serviceTextContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  categoryTextContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    borderRadius: 15,
    zIndex: 1,
  },
  serviceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryText: {
    fontSize: 20,
    color: '#A8C5F3',
    textAlign: 'right',
  },
  separator: {
    borderBottomWidth: 10,
    borderColor: 'transparent',
  },
  instantSearchStyle: {
    backgroundColor: 'green',
  },
  infiniteHits: {
    backgroundColor: 'green',
    fontFamily: 'Times',
    fontSize: 24,
    //height: 500,
  },
});
