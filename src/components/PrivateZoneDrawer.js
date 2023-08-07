import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServiMarket from '../screens/PrivateZone/ServiMarket';
import MyProfile from '../screens/PrivateZone/MyProfile';
import MyServices from '../screens/PrivateZone/MyServices';
import MyAppointments from '../screens/PrivateZone/MyAppointments';
import ViewHistory from '../screens/PrivateZone/ViewHistory';
import MyWallet from '../screens/PrivateZone/MyWallet';
import MySettings from '../screens/PrivateZone/MySettings';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/routers';

const CustomDrawerContent = ({handleSignOut, user, navigation}) => {
  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView style={styles.drawerContentScrollViewStyle}>
      <DrawerItem
        style={styles.drawerItemStyle}
        label=""
        icon={({focused, color, size}) => (
          <View style={styles.drawerCloseIconContainer}>
            <TouchableOpacity onPress={closeDrawer}>
              <Icon
                name="close"
                size={size}
                color={color}
                style={styles.drawerCloseIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      />

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
      <Icon name="menu" size={24} color="white" style={{marginRight: 15}} />
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
        headerStyle: styles.drawerHeaderStyle, // Aplica el estilo al título del Drawer
        headerTitleStyle: styles.drawerHeaderTitleStyle, // Aplica el estilo al título del Drawer
        drawerStyle: {
          width: '55%',
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
  drawerHeaderStyle: {
    backgroundColor: '#1E3264',
  },
  drawerHeaderTitleStyle: {
    color: 'white',
  },
  drawerItemStyle: {
    marginLeft: 0,
    marginRight: 0,
  },
  drawerItemLabelStyle: {
    color: 'white',
    fontFamily: 'Comic Sans',
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerCloseIconContainer: {
    minWidth: '90%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  drawerCloseIcon: {
    color: 'white',
  },
});

export default PrivateZoneDrawer;
