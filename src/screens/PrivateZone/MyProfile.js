import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomImage from '../../components/CustomImage';

function MyProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userRef = firestore().collection('users').doc(user.email);

      userRef.get().then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setCurrentUser(userData);
          setDisplayName(userData.displayName);
          setGivenName(userData.givenName);
          setFamilyName(userData.familyName);
          setPhotoURL(userData.photoURL);
        }
      });
    }
  }, []);

  const handleSaveChanges = async () => {
    const user = auth().currentUser;
    if (user) {
      const userRef = firestore().collection('users').doc(user.email);
      try {
        await userRef.update({
          displayName,
          givenName,
          familyName,
          photoURL,
        });
        Alert.alert('Éxito', 'Cambios guardados exitosamente');
      } catch (error) {
        Alert.alert('Error', 'No se pudieron guardar los cambios');
      }
    }
  };
  console.log(photoURL);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Mi Perfil</Text>

      {currentUser && (
        <>
          {photoURL ? (
            <Image source={{uri: photoURL}} style={styles.headerImage} />
          ) : (
            <CustomImage
              imageName="logo"
              width={100}
              height={100}
              borderRadius={50}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            value={displayName}
            onChangeText={text => setDisplayName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={givenName}
            onChangeText={text => setGivenName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={familyName}
            onChangeText={text => setFamilyName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="URL de la Foto de Perfil"
            value={photoURL}
            onChangeText={text => setPhotoURL(text)}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 75,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3264',
  },
  input: {
    width: 290,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  saveButton: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
    backgroundColor: '#1363DF',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MyProfile;
