import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import firestore
import CustomImage from '../../components/CustomImage';

function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUppercase, setPasswordUppercase] = useState(false);
  const [passwordLowercase, setPasswordLowercase] = useState(false);
  const [passwordDigit, setPasswordDigit] = useState(false);
  const [passwordSpecialChar, setPasswordSpecialChar] = useState(false);
  const [notSigningUp, setNotSigningUp] = useState(true);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const validateEmail = () => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      setEmailValid(emailRegex.test(email));
    };

    const validatePassword = () => {
      setPasswordMatch(password === repeatPassword);
      setPasswordLength(password.length >= 8);
      setPasswordUppercase(/[A-Z]/.test(password));
      setPasswordLowercase(/[a-z]/.test(password));
      setPasswordDigit(/[0-9]/.test(password));
      setPasswordSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    };

    validateEmail();
    validatePassword();
  }, [email, password, repeatPassword]);

  const handleSignUp = async () => {
    try {
      setNotSigningUp(false);
      console.log('Creando');
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('Obteniendo user nuevo');
      const newUser = auth().currentUser;
      console.log('Enviar mail de verificación');
      await newUser.sendEmailVerification();

      // Crear el documento en la colección "users" si no existe
      const userRef = firestore().collection('users').doc(email);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log('Creando documento del usuario en Firestore');
        await userRef.set({
          email: email,
          displayName: '',
          givenName: '',
          familyName: '',
          photoURL: '',
        });
      }

      console.log('Aviso para verificar email');
      Alert.alert(
        'Verifica tu email',
        'Tu usuario ha sido creado; sin embargo, para poder iniciar sesión debes revisar tu correo y hacer click en el link enviado para verificar tu dirección de email.',
      );
      console.log('Yendo a Login');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error en el registro:', error);
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          setEmail('');
          emailInputRef.current.focus();
          errorMessage = 'Email inválido';
          break;
        case 'auth/email-already-in-use':
          setEmail('');
          emailInputRef.current.focus();
          errorMessage = 'Email ya registrado';
          break;
        case 'auth/weak-password':
          setPassword('');
          setRepeatPassword('');
          errorMessage = 'Contraseña muy corta';
          passwordInputRef.current.focus();
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setNotSigningUp(true);
    }
  };

  const renderValidationIndicator = (valid, text) => {
    return valid ? (
      <Text style={[styles.validationIndicator, {color: 'darkgreen'}]}>
        ✓ {text}
      </Text>
    ) : (
      <Text style={[styles.validationIndicator, {color: 'red'}]}>✗ {text}</Text>
    );
  };

  return (
    <View style={styles.container}>
      <CustomImage imageName="logo" width={75} height={75} borderRadius={10} />
      <Text style={styles.titleText}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
        ref={emailInputRef}
      />
      {renderValidationIndicator(emailValid, 'Email debe ser válido')}

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        ref={passwordInputRef}
      />
      {renderValidationIndicator(passwordLength, 'Mínimo 8 caracteres')}
      {renderValidationIndicator(passwordUppercase, 'Mínimo 1 mayúscula')}
      {renderValidationIndicator(passwordLowercase, 'Mínimo 1 minúscula')}
      {renderValidationIndicator(passwordDigit, 'Mínimo 1 dígito')}
      {renderValidationIndicator(
        passwordSpecialChar,
        'Mínimo 1 caracter especial',
      )}

      <TextInput
        style={styles.input}
        placeholder="Repetir Contraseña"
        value={repeatPassword}
        onChangeText={text => setRepeatPassword(text)}
        secureTextEntry
      />
      {renderValidationIndicator(passwordMatch, 'Contraseñas coinciden')}

      <TouchableOpacity
        style={[
          styles.registerButton,
          {
            backgroundColor:
              emailValid &&
              passwordMatch &&
              passwordLength &&
              passwordUppercase &&
              passwordLowercase &&
              passwordDigit &&
              passwordSpecialChar &&
              notSigningUp
                ? '#1363DF'
                : 'gray',
          },
        ]}
        onPress={handleSignUp}
        disabled={
          !(
            emailValid &&
            passwordMatch &&
            passwordLength &&
            passwordUppercase &&
            passwordLowercase &&
            passwordDigit &&
            passwordSpecialChar &&
            notSigningUp
          )
        }>
        <Text style={styles.registerButtonText}>Registrarme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.loginButtonText}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>
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
  input: {
    width: 290,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  validationIndicator: {
    marginVertical: 2,
    fontWeight: 'bold',
  },
  registerButton: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  loginButton: {
    marginTop: 20,
  },
  loginButtonText: {
    color: '#1363DF',
  },
});

export default SignUp;
