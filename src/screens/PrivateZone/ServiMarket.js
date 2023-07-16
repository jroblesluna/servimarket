import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

function PrivateZone() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Private Zone Screen!</Text>
      {/* Agregar más componentes y contenido aquí */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrivateZone;
