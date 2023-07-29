import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';

function ServiMarket() {
  const [services, setServices] = useState([]);
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

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const servicesQuerySnapshot = await firestore()
          .collection('services')
          .limit(5)
          .get();
        const combinedServicesWithCategories = servicesQuerySnapshot.docs.map(
          async serviceDocument => {
            const serviceDocumentData = serviceDocument.data();
            if (serviceDocumentData.serviceCategory) {
              const serviceCategoryId = serviceDocumentData.serviceCategory.id;
              const parsedServiceCategoryId = parseInt(serviceCategoryId, 10); // Convertir a entero
              const serviceCategory = categories.find(
                category =>
                  category.serviceCategoryId === parsedServiceCategoryId,
              );
              return {
                ...serviceDocumentData,
                serviceCategory,
              };
            } else {
              return serviceDocumentData;
            }
          },
        );
        const servicesWithCategories = await Promise.all(
          combinedServicesWithCategories,
        );
        setServices(servicesWithCategories);
      } catch (error) {
        console.error('Error fetching services data:', error);
      }
    };

    fetchServicesData();
  }, [categories]);

  const renderServiceItem = ({item}) => (
    <View style={styles.serviceItemContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.serviceImage} />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.serviceText}>{item.serviceEnglish}</Text>
        {item.serviceCategory && (
          <Text style={styles.categoryText}>
            {item.serviceCategory.serviceCategoryEnglish}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.searchTitle}>Estoy buscando</Text>
      <View style={styles.servicesView}>
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={item => item.serviceId.toString()}
          showsHorizontalScrollIndicator={true}
          horizontal
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  servicesView: {
    //height: 150,
  },
  serviceItemContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    height: 150,
  },
  serviceImage: {
    width: 225,
    height: 150,
    borderRadius: 15,
  },
  textContainer: {
    position: 'absolute',
    width: 225,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 20,
    color: '#A8C5F3',
    textAlign: 'right',
  },
});

export default ServiMarket;
