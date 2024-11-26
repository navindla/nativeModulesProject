///////// workng ws socket link pl6 ///////////////////////

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WebSocketScreen = () => {
  const [messages, setMessages] = useState('');




  
  useEffect(() => {
    // Initialize WebSocket connection
    // const ws = new WebSocket('ws://echo.websocket.org'); // Replace with your WebSocket URL
    // const ws = new WebSocket('ws://93.127.206.66:8081/30979/watchEvents');
    const ws = new WebSocket('wss://qaws.player6sports.com/30979/watchEvents');

    // When the connection is opened
    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send('Hello Server'); // Optional: Send a message to the server
    };

    // When a message is received
    ws.onmessage = (event) => {
      console.log('Message received:', event);
      setMessages(event.data)
    };

    // When an error occurs
    ws.onerror = (error) => {
      console.log('WebSocket error:', error.message);
    };

    // When the connection is closed
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    // Cleanup the WebSocket connection on unmount
    return () => {
      ws.close();
      console.log('WebSocket connection closed on cleanup');
    };
  }, []);




  return (
    <View style={styles.container}>
      <Text style={styles.text}>WebSocket Console Logger</Text>
      <Text style={styles.text}>respo: {messages}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default WebSocketScreen;

