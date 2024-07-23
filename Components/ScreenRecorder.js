// ScreenRecorderScreen.js
// import React, { useState } from 'react';
// import { Button, View, Text } from 'react-native';
// import { NativeModules } from 'react-native';

// const { ScreenRecorder } = NativeModules;

// const ScreenRecorderScreen = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [filePath, setFilePath] = useState(null);

//   const startRecording = async () => {
//     try {
//       const result = await ScreenRecorder.startRecording();
//       console.log(result);
//       setIsRecording(true);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       const path = await ScreenRecorder.stopRecording();
//       console.log('Recording saved to:', path);
//       setFilePath(path);
//       setIsRecording(false);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button
//         onPress={isRecording ? stopRecording : startRecording}
//         title={isRecording ? 'Stop Recording' : 'Start Recording'}
//       />
//       {filePath && <Text>Saved to: {filePath}</Text>}
//     </View>
//   );
// };

// export default ScreenRecorderScreen;

import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, PermissionsAndroid, Alert, Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { ScreenRecorder } = NativeModules;

const ScreenRecorderScreenApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [filePath, setFilePath] = useState(null);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW, // Required for Android SDK 23+
      ]);

      const allPermissionsGranted =
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.SYSTEM_ALERT_WINDOW'] === PermissionsAndroid.RESULTS.GRANTED;

      if (allPermissionsGranted) {
        return true;
      } else {
        Alert.alert('Permissions not granted');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ScreenRecorder.startRecording();
      console.log('Start recording result:', result);
      setIsRecording(true);
    } catch (e) {
      console.error('Start Recording Error:', e);
    }
  };

  const stopRecording = async () => {
    try {
      const path = await ScreenRecorder.stopRecording();
      console.log('Recording saved to:', path);
      setFilePath(path);
      setIsRecording(false);
    } catch (e) {
      console.error('Stop Recording Error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {isRecording ? (
        <>
          <Text style={styles.recordingText}>Recording...</Text>
          <Button onPress={stopRecording} title="Stop Recording" />
        </>
      ) : (
        <>
          <Button onPress={startRecording} title="Start Recording" />
          {filePath && <Text>Saved to: {filePath}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'red',
  },
});

export default ScreenRecorderScreenApp;




