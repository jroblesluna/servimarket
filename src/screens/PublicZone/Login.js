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
import firestore from '@react-native-firebase/firestore';

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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      console.log('Checking if currentUser');
      if (currentUser) {
        console.log('Checking if emailVerified');
        if (currentUser.emailVerified) {
          console.log('navigation.navigate(PrivateZone);');
          navigation.navigate('PrivateZone');
        } else {
          console.log('!isLoggingIn && notSigningUp?');
          if (!isLoggingIn && notSigningUp) {
            console.log('Yes -> auth().signOut();');
            auth().signOut();
          } else {
            console.log('Nope. Ignore');
          }
        }
      } else {
        console.log('No currentUser');
      }
    });

    return unsubscribe;
  }, [isLoggingIn, notSigningUp, navigation]);

  const handleGoogleSignIn = async () => {
    console.log('1. DESHABILITANDO...');
    setIsLoggingIn(true);
    try {
      console.log('2. Has Play Services');
      const playServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log(playServices);
      console.log('3. const {idToken} = await GoogleSignin.signIn();');
      const {idToken} = await GoogleSignin.signIn();
      console.log(
        '4. const googleCredential = auth.GoogleAuthProvider.credential(idToken);',
      );
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('5. await auth().signInWithCredential(googleCredential);');
      const googleUser = await auth().signInWithCredential(googleCredential);

      console.log('6. Firestore', googleUser);

      const userRef = firestore()
        .collection('users')
        .doc(googleUser.user.email);
      console.log('userRef', userRef);
      const userDoc = await userRef.get();
      console.log('userDoc', userDoc);

      if (userDoc.exists) {
        console.log('El documento del usuario ya existe en Firestore');
      } else {
        console.log('Creando documento del usuario en Firestore');
        await firestore().collection('users').doc(googleUser.user.email).set({
          email: googleUser.user.email,
          displayName: googleUser.user.displayName,
          givenName: googleUser.additionalUserInfo.profile.given_name,
          familyName: googleUser.additionalUserInfo.profile.family_name,
          photoURL: googleUser.user.photoURL,
        });
      }

      console.log('7. navigation.navigate(PrivateZone);');
      navigation.navigate('PrivateZone');
    } catch (error) {
      console.log('8. Error', error.message);
    } finally {
      console.log('9. HABILITANDO...');
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignIn = async () => {
    console.log('emailSignIn');

    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      emailInputRef.current.focus();
      return;
    }

    try {
      console.log('Deshabilitando...');
      setIsLoggingIn(true);
      const {user} = await auth().signInWithEmailAndPassword(email, password);
      console.log('Logged In...');
      if (user && !user.emailVerified) {
        Alert.alert(
          'Email no verificado',
          'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
        );
        setIsLoggingIn(false);
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
          emailInputRef.current.focus();
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Combinación de usuario y clave incorrecta';
          setPassword('');
          passwordInputRef.current.focus();
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('Habilitando...');
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignUp = () => {
    try {
      console.log('Deshabilitando');
      setIsLoggingIn(false);
      navigation.navigate('SignUp');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setEmail('');
      setPassword('');
      console.log('Habilitando');
      setIsLoggingIn(false);
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
        ref={emailInputRef}
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
            isLoggingIn && styles.disabledButton,
          ]}
          onPress={() => handleEmailSignIn()}
          disabled={isLoggingIn}>
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
