import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {connectSearchBox} from 'react-instantsearch-native';
import InsetShadow from './InsetShadow';

const getRandomPlaceholder = () => {
  const placeholders = [
    'Wedding Planner',
    'Fontanero',
    'Kids Teacher',
    'Profesor de piano',
    'Consultor educativo',
    'House painting',
    'Programador',
    'Architecht',
    'Coreographer',
    'Auxiliar contable',
    'Party planner',
    'Instructor de buceo',
  ];
  const randomIndex = Math.floor(Math.random() * placeholders.length);
  return placeholders[randomIndex];
};

const SearchBox = ({currentRefinement, refine}) => {
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());

  useEffect(() => {
    if (!currentRefinement) {
      const interval = setInterval(() => {
        setPlaceholder(getRandomPlaceholder());
      }, 500); // Cambiar cada 3 segundos (ajusta según tus preferencias)

      return () => clearInterval(interval);
    }
  }, [currentRefinement]);

  return (
    <View style={styles.container}>
      <InsetShadow
        containerStyle={styles.insetShadowStyle}
        elevation={15}
        left={true}
        top={true}
        right={false}
        bottom={false}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={value => refine(value)}
          value={currentRefinement}
          placeholder={placeholder}
          autoFocus
        />
      </InsetShadow>
    </View>
  );
};

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    height: 'auto',
  },
  textInputStyle: {
    height: 48,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  insetShadowStyle: {borderRadius: 5, height: 'auto'},
});

export default connectSearchBox(SearchBox);
