import React from 'react';
import { View, StyleSheet } from 'react-native';
// import BluetoothButton from './BluetoothButton';
import BluetoothButton from './Components/BluetoothButton';
import NetworkInfoButton from './Components/NetworkInfoButton';
import ScreenRecorderScreenApp from './Components/ScreenRecorder';

const App = () => {
  return (
    <View style={styles.container}>
      <NetworkInfoButton/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
