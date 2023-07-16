/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Importar las fuentes de iconos para iOS y Android
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Registrar las fuentes de iconos
MaterialIcons.loadFont();
FontAwesome.loadFont();

AppRegistry.registerComponent(appName, () => App);
