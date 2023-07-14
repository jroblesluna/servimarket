import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Image, StyleSheet} from 'react-native';
import Market from '../screens/PrivateZone/Market';

const CustomDrawerContent = ({handleSignOut, user}) => {
  return (
    <DrawerContentScrollView>
      <View style={styles.headerContainer}>
        {user && user.photoURL && (
          <Image source={{uri: user.photoURL}} style={styles.headerImage} />
        )}
      </View>
      <DrawerItem label="Sign Out" onPress={handleSignOut} />
    </DrawerContentScrollView>
  );
};

function PrivateZoneDrawer({handleSignOut, user}) {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={() => (
        <CustomDrawerContent handleSignOut={handleSignOut} user={user} />
      )}>
      <Drawer.Screen name="Main" component={Market} />
      {/* Agregar más pantallas al navegador Drawer */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 75,
  },
});

export default PrivateZoneDrawer;
