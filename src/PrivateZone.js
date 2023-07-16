import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import PrivateZoneDrawer from './components/PrivateZoneDrawer';
import ServiMarket from './screens/PrivateZone/ServiMarket';

function PrivateZone() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      console.log(user);
      if (user != null) {
        console.log('Auth Signing Out');
        await auth().signOut();
      }
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      console.log('isGoogleSignedIn:', isGoogleSignedIn);
      if (isGoogleSignedIn) {
        console.log('Google Signing Out');
        await GoogleSignin.revokeAccess();
      }
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.log('Error en Sign Out: ', error);
    } finally {
    }
  };

  return (
    <PrivateZoneDrawer
      handleSignOut={handleSignOut}
      user={user}
      navigation={navigation}>
      <ServiMarket />
    </PrivateZoneDrawer>
  );
}

export default PrivateZone;
