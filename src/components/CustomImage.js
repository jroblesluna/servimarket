import React from 'react';
import {Image, StyleSheet} from 'react-native';

// Importar las imágenes necesarias
import logoImage from '../assets/images/logo.png';

const imageMap = {
  logo: logoImage,
  // Agrega aquí más nombres de archivo y sus rutas de importación correspondientes
};

const CustomImage = ({
  fileName = 'logo',
  width = 150,
  height = 150,
  borderRadius = 25,
}) => {
  const styles = StyleSheet.create({
    imageStyle: {
      width: width,
      height: height,
      borderRadius: borderRadius,
    },
  });

  const imageSource = imageMap[fileName];

  return <Image source={imageSource} style={styles.imageStyle} />;
};

export default CustomImage;
