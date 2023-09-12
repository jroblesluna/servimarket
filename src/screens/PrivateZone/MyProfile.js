import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomImage from '../../components/CustomImage';
import {useTranslation} from 'react-i18next';
import PhoneInput from 'react-native-phone-number-input';
import {useNavigation} from '@react-navigation/native';

function MyProfile() {
  const navigation = useNavigation(); // Initialize the navigation hook
  const {t} = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [given_name, setGivenName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('');
  const [phoneCallingCode, setPhoneCallingCode] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [about, setAbout] = useState('');

  const phoneInputRef = useRef(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userRef = firestore().collection('users').doc(user.email);
      userRef.get().then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setCurrentUser(userData);
          setDisplayName(userData.displayName);
          setGivenName(userData.given_name);
          setFamilyName(userData.family_name);
          setPhotoURL(userData.photoURL);
          setPhoneCountry(userData.phoneCountry);
          setPhoneCallingCode(userData.phoneCallingCode);
          setPhoneNumber(userData.phoneNumber);
          setAddress(userData.address);
          setCity(userData.city);
          setProvince(userData.province);
          setCountry(userData.country);
          setZipcode(userData.zipcode);
          setAbout(userData.about);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (phoneInputRef.current && phoneNumber) {
      phoneInputRef.current.onSelect({
        cca2: phoneCountry,
        callingCode: phoneCallingCode,
      });
      phoneInputRef.current.onChangeText(phoneNumber);
    }
  }, [phoneCallingCode, phoneCountry, phoneNumber]);

  const handleSaveChanges = async () => {
    const user = auth().currentUser;
    if (user) {
      const userRef = firestore().collection('users').doc(user.email);
      try {
        await userRef.update({
          displayName,
          given_name,
          family_name,
          photoURL,
          phoneCountry,
          phoneCallingCode,
          phoneNumber,
          address,
          city,
          province,
          country,
          zipcode,
          about,
        });
        Alert.alert('Éxito', 'Cambios guardados exitosamente');
        navigation.navigate('ServiMarket');
      } catch (error) {
        Alert.alert('Error', 'No se pudieron guardar los cambios', error);
      }
    }
  };

  const handleOnChangeText = text => {
    setPhoneNumber(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

          <View>
            <Text style={styles.fieldText}>{t('email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              value={auth().currentUser.email}
              editable={false}
            />
            <Text style={styles.fieldText}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              value={displayName}
              onChangeText={text => setDisplayName(text)}
            />
            <Text style={styles.fieldText}>Given Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={given_name}
              onChangeText={text => setGivenName(text)}
            />
            <Text style={styles.fieldText}>Family Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={family_name}
              onChangeText={text => setFamilyName(text)}
            />
            <Text style={styles.fieldText}>Phone Number</Text>

            <View style={styles.phoneInputContainer}>
              <PhoneInput
                ref={phoneInputRef}
                defaultCode={phoneCountry}
                countryCode={phoneCountry}
                defaultValue={phoneNumber}
                //value={phoneNumber}
                containerStyle={{
                  height: 45,
                  backgroundColor: 'transparent',
                  alignContent: 'center',
                }}
                textInputStyle={{height: 45}}
                codeTextStyle={{height: 45, paddingVertical: 12}}
                textContainerStyle={{backgroundColor: 'transparent'}}
                onChangeText={text => handleOnChangeText(text)}
              />
            </View>
            <Text style={styles.fieldText}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={text => setAddress(text)}
            />
            <Text style={styles.fieldText}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={text => setCity(text)}
            />
            <Text style={styles.fieldText}>Province</Text>
            <TextInput
              style={styles.input}
              placeholder="Province"
              value={province}
              onChangeText={text => setProvince(text)}
            />
            <Text style={styles.fieldText}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={country}
              onChangeText={text => setCountry(text)}
            />
            <Text style={styles.fieldText}>Zipcode</Text>
            <TextInput
              style={styles.input}
              placeholder="Zipcode"
              value={zipcode}
              onChangeText={text => setZipcode(text)}
            />
            <Text style={styles.fieldText}>About</Text>
            <TextInput
              style={styles.input}
              placeholder="About"
              value={about}
              onChangeText={text => setAbout(text)}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
    flexGrow: 1, // This ensures the content can grow and allows scrolling
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  input: {
    minWidth: '90%',
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#ddd',
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
  fieldText: {
    textAlign: 'left', // Align the text to the left
    fontSize: 16, // Adjust the font size if needed
    fontWeight: 'bold', // Add bold font weight if desired
    color: 'gray', // Adjust the text color if needed
    width: '100%', // Set the width to 100% to ensure the label spans the full width
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  phoneInput: {
    fontSize: 16,
    height: 40,
  },
});

export default MyProfile;
