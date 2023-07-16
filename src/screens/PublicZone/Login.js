import React, {useEffect, useRef, useState} from 'react';
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
import {useRoute} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId:
    '861186813540-hr41m36t7sh491dvc5ug8qrrtmajfp6g.apps.googleusercontent.com',
});

function Login() {
  const route = useRoute();
  const {notSigningUp} = route.params ?? {};

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Estado para controlar el botón de inicio de sesión
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      console.log('Checking...');
      if (currentUser) {
        if (currentUser.emailVerified) {
          navigation.navigate('PrivateZone');
        } else {
          if (!isLoggingIn && notSigningUp) {
            auth().signOut();
          }
        }
      }
    });

    return unsubscribe;
  }, [isLoggingIn, notSigningUp, navigation]);

  const handleGoogleSignIn = async () => {
    console.log(1);
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    console.log(2);
    try {
      console.log('Disabling...');
      setIsLoggingIn(true); // Deshabilitar el botón de inicio de sesión
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('PrivateZone');
    } catch (error) {
    } finally {
      console.log('Enabling...');
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignIn = async () => {
    console.log('emailSignIn');

    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      emailInputRef.current.focus(); // Posicionar el cursor en el campo de correo electrónico
      return;
    }

    try {
      console.log('Deshabilitando...');
      setIsLoggingIn(true); // Deshabilitar el botón de inicio de sesión
      const {user} = await auth().signInWithEmailAndPassword(email, password);
      console.log('Logged In...');
      if (user && !user.emailVerified) {
        Alert.alert(
          'Email no verificado',
          'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
        );
        setIsLoggingIn(false); // Habilitar el botón de inicio de sesión
        return;
      }
      navigation.navigate('PrivateZone');
    } catch (error) {
      console.log(error.message);
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          setEmail('');
          emailInputRef.current.focus(); // Posicionar el cursor en el campo de correo electrónico
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          //errorMessage = 'Usuario no encontrado';
          //break;
          errorMessage = 'Combinación de usuario y clave incorrecta';
          setPassword('');
          passwordInputRef.current.focus(); // Posicionar el cursor en el campo de correo electrónico
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('Habilitando...');
      setIsLoggingIn(false); // Habilitar el botón de inicio de sesión
    }
  };

  const handleEmailSignUp = () => {
    try {
      console.log('Deshabilitando');
      setIsLoggingIn(false); // Habilitar el botón de inicio de sesión
      navigation.navigate('SignUp');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setEmail('');
      setPassword('');
      console.log('Habilitando');
      setIsLoggingIn(false); // Habilitar el botón de inicio de sesión
    }
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
        ref={emailInputRef} // Asignar la referencia al campo de correo electrónico
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        ref={passwordInputRef}
      />
      <View style={styles.classicLoginView}>
        <TouchableOpacity
          style={[
            styles.classicButton,
            styles.signInClassicButton,
            isLoggingIn && styles.disabledButton, // Aplicar estilo de botón deshabilitado cuando isLoggingIn es true
          ]}
          onPress={() => handleEmailSignIn()}
          disabled={isLoggingIn} // Deshabilitar el botón mientras se está realizando el inicio de sesión
        >
          <Text style={styles.classicButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.classicButton,
            styles.signUpClassicButton,
            isLoggingIn && styles.disabledButton,
          ]}
          onPress={() => handleEmailSignUp()}>
          <Text style={styles.classicButtonText}>Registrarme</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hr} />
      <GoogleSigninButton
        style={[styles.loginGoogleButton, isLoggingIn && styles.disabledButton]}
        onPress={() => handleGoogleSignIn()}
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
    width: 300,
    height: 50,
    margin: 5,
  },
  disabledButton: {
    opacity: 0.5, // Cambiar la opacidad del botón deshabilitado
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
