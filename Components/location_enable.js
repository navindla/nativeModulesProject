// enables location like Uber app
// dpndcy : npm i react-native-android-location-enabler   
// url: https://www.npmjs.com/package/react-native-android-location-enabler

import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

const App = () => {
  const [locationStatus, setLocationStatus] = useState('Unknown');

  // Function to check if location services are enabled
  const checkLocation = async () => {
    if (Platform.OS === 'android') {
      try {
        const isEnabled = await isLocationEnabled();
        setLocationStatus(isEnabled ? 'Location is Enabled' : 'Location is Disabled');
      } catch (error) {
        console.error('Error checking location status:', error.message);
        setLocationStatus('Error checking location status');
      }
    } else {
      setLocationStatus('Not supported on this platform');
    }
  };

  // Function to prompt user to enable location services
  const enableLocation = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await promptForEnableLocationIfNeeded();
        console.log('Enable Location Result:', result);
        if (result === 'enabled' || result === 'already-enabled') {
          setLocationStatus('Location is Enabled');
        }
      } catch (error) {
        console.error('Error enabling location:', error.message);
        if (error.code === 'ERR00') {
          setLocationStatus('User canceled enabling location');
        } else {
          setLocationStatus('Error enabling location');
        }
      }
    } else {
      setLocationStatus('Not supported on this platform');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Location Enabler</Text>
      <Button title="Check Location Status" onPress={checkLocation} />
      <Button title="Enable Location" onPress={enableLocation} style={styles.button} />
      <Text style={styles.status}>Status: {locationStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default App;
