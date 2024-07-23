import React from 'react';
import { NativeModules, Button, View, StyleSheet, Alert } from 'react-native';

const { BluetoothModule } = NativeModules;

const BluetoothButton = () => {
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
