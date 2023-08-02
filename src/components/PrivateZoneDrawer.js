import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServiMarket from '../screens/PrivateZone/ServiMarket';
import SearchServices from '../screens/PrivateZone/SearchServices';
import ServiceInstantSearch from '../screens/PrivateZone/ServiceInstantSearch';
import MyProfile from '../screens/PrivateZone/MyProfile';
import MyServices from '../screens/PrivateZone/MyServices';
import MyAppointments from '../screens/PrivateZone/MyAppointments';
import ViewHistory from '../screens/PrivateZone/ViewHistory';
import MyWallet from '../screens/PrivateZone/MyWallet';
import MySettings from '../screens/PrivateZone/MySettings';
import {useNavigation} from '@react-navigation/native';

const CustomDrawerContent = ({handleSignOut, user, navigation}) => {
  return (
    <DrawerContentScrollView style={styles.drawerContentScrollViewStyle}>
      <View style={styles.headerContainer}>
        {user && user.photoURL && (
          <Image source={{uri: user.photoURL}} style={styles.headerImage} />
        )}
      </View>
      <DrawerItem
        style={styles.drawerItemStyle}
        label="My Profile"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('MyProfile')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="ServiMarket"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('ServiMarket')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="Search Services"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('SearchServices')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="Service Instant Search"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('ServiceInstantSearch')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="My Services"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('MyServices')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="My Appointments"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('MyAppointments')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="View History"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('ViewHistory')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="My Wallet"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('MyWallet')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="My Settings"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={() => navigation.navigate('MySettings')}
      />
      <DrawerItem
        style={styles.drawerItemStyle}
        label="Sign Out"
        labelStyle={styles.drawerItemLabelStyle}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
};

const HeaderRight = () => {
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <TouchableOpacity onPress={handleOpenDrawer}>
      <Icon name="menu" size={24} color="black" style={{marginRight: 15}} />
    </TouchableOpacity>
  );
};

function PrivateZoneDrawer({handleSignOut, user, navigation}) {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="ServiMarket" // Modificar esta línea
      screenOptions={{
        drawerType: 'front',
        drawerPosition: 'right',

        drawerStyle: {
          width: '66%',
          opacity: 0.85,
        },
        headerLeft: () => null, // Elimina el icono de hamburguesa del lado izquierdo
        headerRight: () => <HeaderRight navigation={navigation} />,
        headerTitleAlign: 'center', // Centra el título en la barra de navegación
      }}
      drawerContent={() => (
        <CustomDrawerContent
          handleSignOut={handleSignOut}
          user={user}
          navigation={navigation}
        />
      )}>
      <Drawer.Screen name="MyProfile" component={MyProfile} />
      <Drawer.Screen name="ServiMarket" component={ServiMarket} />
      <Drawer.Screen name="SearchServices" component={SearchServices} />
      <Drawer.Screen name="ServiceInstantSearch" component={ServiceInstantSearch} />
      <Drawer.Screen name="MyServices" component={MyServices} />
      <Drawer.Screen name="MyAppointments" component={MyAppointments} />
      <Drawer.Screen name="ViewHistory" component={ViewHistory} />
      <Drawer.Screen name="MyWallet" component={MyWallet} />
      <Drawer.Screen name="MySettings" component={MySettings} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContentScrollViewStyle: {
    backgroundColor: '#1E3264',
  },
  headerContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 75,
  },
  drawerItemStyle: {
    marginVertical: 1,
    marginLeft: 2,
    marginRight: 0,
  },
  drawerItemLabelStyle: {
    color: 'white',
    fontFamily: 'Comic Sans',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PrivateZoneDrawer;
