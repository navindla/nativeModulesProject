



import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const [data, setData] = useState([]);


  //// venky userID //

  const injectedJavaScript = `
    // Create a new EventSource to listen for server-sent events
    const eventSource = new EventSource('https://apiqa.player6sports.com/1.0/auth/User/191/watchEvents');
    
    eventSource.addEventListener('ping', function(event) {
      // Send the received data back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ping', data: JSON.parse(event.data) }));
    });

     eventSource.addEventListener('opnSel', function(event) {
      // Send the received data back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'opnSel', data: JSON.parse(event.data) }));
    });

    eventSource.addEventListener('innScors', function(event) {
      // Send the received data back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'innScors', data: JSON.parse(event.data) }));
    });

    eventSource.onerror = function(error) {
      console.error('EventSource failed:', error);
      // Optionally send an error message back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'Error occurred with EventSource' }));
    };
    
    true; // Required for the injected script to execute correctly
  `;

  // const onMessage = (event) => {
  //   const receivedData = event.nativeEvent.data;
  //  // console.log('Received data from WebView:', receivedData); // Log incoming data
  //   try {
  //     const parsedData = JSON.parse(receivedData);
  //   //  console.log('Respo :', parsedData.innScors); // Log incoming data
  //    // setData((prevData) => [...prevData, parsedData]); // Store the data in state
  //   } catch (error) {
  //     console.error('Error parsing message from WebView:', error);
  //   }
  // };



  //////////////// logs only spec event //////////////////////
  const onMessage = (event) => {
    const receivedData = event.nativeEvent.data;
    
    try {
      const parsedData = JSON.parse(receivedData);
      if (parsedData.type === 'innScors') {
        console.log('Received innScors data from WebView:', parsedData.data);
       // setData((prevData) => [...prevData, parsedData]); // Store only innScors data in state if needed
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };
  



  return (
    <View style={styles.container}>
      <WebView
        source={{ html: '<html><body></body></html>' }} // Load an empty HTML page
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        style={styles.hiddenWebView} // Hide the WebView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    opacity: 0, // Optional: Set opacity to zero if you want it hidden visually
  },
});

export default App;

