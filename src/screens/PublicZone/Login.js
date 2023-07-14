import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import CustomImage from '../../components/CustomImage';

GoogleSignin.configure({
  webClientId:
    '861186813540-hr41m36t7sh491dvc5ug8qrrtmajfp6g.apps.googleusercontent.com',
});

async function onGoogleButtonPress(navigation) {
  console.log(1);
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  console.log(2);
  try {
    const {idToken} = await GoogleSignin.signIn();
    console.log(3);
  } catch (error) {
    console.log(3.1);
    console.log(error);
  }
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  console.log(4);
  await auth().signInWithCredential(googleCredential);
  console.log(5);
  navigation.navigate('PrivateZone');
  console.log(6);
}

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        navigation.navigate('PrivateZone');
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleEmailSignIn = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.message);
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Combinación de usuario y clave incorrecta';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert('Error', errorMessage);
      setEmail('');
      setPassword('');
    }
  };

  const handleEmailSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <CustomImage
        imageName="logo"
        width={100}
        height={100}
        borderRadius={15}
      />

      <Text style={styles.titleText}>ServiMarket.app</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.classicLoginView}>
        <TouchableOpacity
          style={[styles.classicButton, styles.signInClassicButton]}
          onPress={() => handleEmailSignIn()}>
          <Text style={styles.classicButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.classicButton, styles.signUpClassicButton]}
          onPress={() => handleEmailSignUp()}>
          <Text style={styles.classicButtonText}>Registrarme</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hr} />
      <GoogleSigninButton
        style={styles.loginGoogleButton}
        onPress={() => onGoogleButtonPress(navigation)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  classicLoginView: {
    flexDirection: 'row',
  },
  classicButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  classicButton: {
    width: 142,
    height: 42,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    shadowColor: '#000000',
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 4,
  },
  signInClassicButton: {
    backgroundColor: '#202020',
  },
  signUpClassicButton: {
    backgroundColor: '#1363DF',
  },
  loginGoogleButton: {
    width: 150,
    height: 50,
    margin: 5,
  },
  input: {
    width: 290,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  hr: {
    width: 300,
    height: 2,
    borderLeftColor: '#505050',
    borderBottomColor: '#606060',
    borderTopColor: '#c0c0c0',
    borderRightColor: '#d0d0d0',
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default Login;
