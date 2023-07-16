import React from 'react';
import Navigation from './components/Navigation';
import {Animated} from 'react-native';

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

function App() {
  return <Navigation />;
}

export default App;
