
////////////// working SSE code W/O Library ///////////////////
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

const MySSEComponentWithoutLibrary = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    
    // Open a connection to the SSE endpoint
    xhr.open('GET', 'https://sse.dev/test', true);
    xhr.setRequestHeader('Accept', 'text/event-stream');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Connection', 'keep-alive');
    
    // Event listener for response data
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.LOADING) {
        // Break the response into lines
        const lines = xhr.responseText.split('\n');
        
        // Filter and process only "data: " lines
        lines.forEach((line) => {
          if (line.startsWith('data: ')) {
            try {
              // Parse the JSON data
              const parsedData = JSON.parse(line.replace('data: ', ''));
              
              // Update the state with the new event data
              setEvents((prevEvents) => [...prevEvents, parsedData]);
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        });
      }
    };

    // Send the request to establish the connection
    xhr.send();

    // Clean up: close the connection when component unmounts
    return () => {
      xhr.abort();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>SSE Events from https://sse.dev/test</Text>
      <ScrollView style={{ marginTop: 10, height: 400 }}>
        {events.map((event, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <Text>{`Message: ${event.msg}`}</Text>
            <Text>{`SSE Dev: ${event.sse_dev}`}</Text>
            <Text>{`Time: ${new Date(event.now).toLocaleTimeString()}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MySSEComponentWithoutLibrary;
