import React from 'react';
import Navigation from './components/Navigation';
import {Animated} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n'; // Import the i18n configuration

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Navigation />
    </I18nextProvider>
  );
}

export default App;
