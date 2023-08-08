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
import firestore from '@react-native-firebase/firestore'; // Add this line
import storage from '@react-native-firebase/storage'; // Add this line
import CustomImage from '../../components/CustomImage';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

GoogleSignin.configure({
  webClientId:
    '861186813540-hr41m36t7sh491dvc5ug8qrrtmajfp6g.apps.googleusercontent.com',
});

function Login() {
  const {t} = useTranslation(); // Initialize the translation hook
 const route = useRoute();//
  const {notSigningUp} = route.params ?? {};

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
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
    setIsLoggingIn(true);
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const googleUser = await auth().signInWithCredential(googleCredential);

      // Download the image data
      const response = await fetch(googleUser.user.photoURL);
      const blob = await response.blob();

      // Upload the image to Firebase Storage
      const storageRef = storage().ref(
        `profilePictures/${googleUser.user.email}`,
      );
      await storageRef.put(blob);

      // Get the download URL of the uploaded image
      const downloadURL = await storageRef.getDownloadURL();

      // Update the user's photoURL in Firestore with the Firebase Storage download URL
      const userRef = firestore()
        .collection('users')
        .doc(googleUser.user.email);
      await userRef.update({
        photoURL: downloadURL,
      });

      navigation.navigate('PrivateZone');
    } catch (error) {
      console.log('Error:', error.message);
      Alert.alert('Error', 'An error occurred during sign-in');
    } finally {
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
      <Text style={styles.versionText}>
        {t('version')} {process.env.APP_VERSION}
      </Text>

      <TextInput
        style={styles.inputLogin}
        placeholder={t('email')}
        value={email}
        onChangeText={text => setEmail(text)}
        ref={emailInputRef}
        autoFocus
      />

      <TextInput
        style={styles.inputLogin}
        placeholder={t('password')}
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
          <Text style={styles.classicButtonText}>{t('login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.classicButton,
            styles.signUpClassicButton,
            isLoggingIn && styles.disabledButton,
          ]}
          onPress={() => handleEmailSignUp()}>
          <Text style={styles.classicButtonText}>{t('signup')}</Text>
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
  versionText: {
    fontSize: 18,
  },
  classicLoginView: {
    flexDirection: 'row',
  },
  classicButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  classicButton: {
    width: 142,
    height: 45,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
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
  },
  disabledButton: {
    opacity: 0.5, // Cambiar la opacidad del botón deshabilitado
  },
  inputLogin: {
    width: 290,
    //height: 40,
    fontSize: 18,
    //borderColor: 'gray',
    borderBottomColor: 'gray',
    borderRadius: 2,
    backgroundColor: 'white',
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
