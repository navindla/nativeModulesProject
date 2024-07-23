import React, { useState } from 'react';
import { NativeModules, Button, View, StyleSheet, Alert, FlatList, Text, PermissionsAndroid, Platform } from 'react-native';

const { BluetoothModule } = NativeModules;

const BluetoothButton = () => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const scanForDevices = async () => {
    const permissionsGranted = await requestBluetoothPermissions();
    if (!permissionsGranted) {
      Alert.alert('Permissions denied', 'Cannot scan for devices without the required permissions.');
      return;
    }
    try {
      const devices = await BluetoothModule.scanForDevices();
      setDiscoveredDevices(devices);
      if (devices.length > 0) {
        Alert.alert('Discovered Devices', devices.join('\n'));
      } else {
        Alert.alert('No Devices Found', 'No Bluetooth devices found during scan.');
      }
    } catch (error) {
      Alert.alert('Failed', error.message);
    }
  };

  const enableBluetooth = async () => {
    try {
      const result = await BluetoothModule.enableBluetooth();
      Alert.alert('Success', result);
    } catch (error) {
      Alert.alert('Failed', error.message);
    }
  };

  const disableBluetooth = async () => {
    try {
      const result = await BluetoothModule.disableBluetooth();
      Alert.alert('Success', result);
    } catch (error) {
      Alert.alert('Failed', error.message);
    }
  };

  const getPairedDevices = async () => {
    try {
      const pairedDevices = await BluetoothModule.getPairedDevices();
      if (pairedDevices.length > 0) {
        Alert.alert('Paired Devices', pairedDevices.join('\n'));
      } else {
        Alert.alert('No Paired Devices', 'There are no paired Bluetooth devices.');
      }
    } catch (error) {
      Alert.alert('Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Enable Bluetooth" onPress={enableBluetooth} />
      <Button title="Disable Bluetooth" onPress={disableBluetooth} />
      <Button title="Get Paired Devices" onPress={getPairedDevices} />
      <Button title="Scan for Devices" onPress={scanForDevices} />
      <FlatList
        data={discoveredDevices}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
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

export default BluetoothButton;
