import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button, Alert } from 'react-native';

const Player6SSEComponent = () => {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // Connection status
  const [isError, setIsError] = useState(false); // Error state for connection failure
  const xhrRef = useRef(null); // To hold the XMLHttpRequest reference
  const bufferRef = useRef(''); // To hold any incomplete lines from the data stream
  const retryTimeoutRef = useRef(null); // For reconnection attempts

  // Memoized function to handle SSE data processing
  const handleStreamData = useCallback((responseText) => {
    const lines = responseText.split('\n');
    let currentEvent = '';

    lines.forEach((line) => {
      if (line.startsWith('event: ')) {
        currentEvent = line.replace('event: ', '').trim();
      }

      if (line.startsWith('data: ')) {
        try {
          const eventData = JSON.parse(line.replace('data: ', ''));

          // Add the new event at the top of the list
          setEvents((prevEvents) => [
            { event: currentEvent, data: eventData },
            ...prevEvents,
          ]);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      }
    });
  }, []);

  // Function to start listening to SSE
  const startSSE = useCallback(() => {
    if (!xhrRef.current) {
      setIsConnected(true);
      setIsError(false);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://apiqa.player6sports.com/1.0/auth/User/191/watchEvents', true);
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('Connection', 'keep-alive');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.LOADING) {
          bufferRef.current += xhr.responseText; // Append new data to buffer
          const completeData = bufferRef.current;

          // Process only the complete portion of the data stream
          const lastNewlineIndex = completeData.lastIndexOf('\n');
          if (lastNewlineIndex !== -1) {
            const processableData = completeData.slice(0, lastNewlineIndex + 1);
            bufferRef.current = completeData.slice(lastNewlineIndex + 1); // Keep the remainder in the buffer
            handleStreamData(processableData); // Process the data
          }
        }
      };

      xhr.onerror = () => {
        setIsError(true);
        console.error('SSE connection error.');
        reconnectWithBackoff();
      };

      xhr.send(); // Send the request
      xhrRef.current = xhr; // Store the xhr instance in ref
    }
  }, [handleStreamData]);

  // Function to stop listening to SSE
  const stopSSE = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort(); // Abort the XMLHttpRequest
      xhrRef.current = null; // Reset the reference
      setIsConnected(false);
      clearTimeout(retryTimeoutRef.current); // Clear any retry attempts
      console.log('SSE connection closed');
    }
  }, []);

  // Reconnect with backoff in case of errors
  const reconnectWithBackoff = useCallback(() => {
    if (!xhrRef.current) {
      let retryCount = 1;
      const maxRetryAttempts = 5;

      const retryConnection = () => {
        if (retryCount <= maxRetryAttempts) {
          console.log(`Retrying connection attempt #${retryCount}`);
          startSSE(); // Attempt to reconnect
          retryCount += 1;
          retryTimeoutRef.current = setTimeout(retryConnection, retryCount * 2000); // Exponential backoff
        } else {
          console.log('Max retry attempts reached.');
          setIsError(true);
        }
      };

      retryConnection(); // Start the first retry attempt
    }
  }, [startSSE]);

  // Cleanup the connection on component unmount
  useEffect(() => {
    return () => {
      stopSSE(); // Abort the connection and cleanup
    };
  }, [stopSSE]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>SSE Events from Player6</Text>

      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <Button title="Start SSE" onPress={startSSE} disabled={isConnected} />
        <Button title="Stop SSE" onPress={stopSSE} disabled={!isConnected} style={{ marginLeft: 10 }} />
      </View>

      {isError && (
        <Text style={{ color: 'red', marginBottom: 10 }}>Error: Connection failed. Retrying...</Text>
      )}

      <ScrollView style={{ marginTop: 10, height: 400 }}>
        {events.map((event, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <Text>{`Event: ${event.event}`}</Text>
            <Text>{`Match ID: ${event.data.matchId}`}</Text>
            <Text>{`Innings: ${event.data.innings}`}</Text>
            <Text>{`Team ID: ${event.data.teamId}`}</Text>
            <Text>{`Runs: ${event.data.runs}`}</Text>
            <Text>{`Wickets: ${event.data.wickets}`}</Text>
            <Text>{`Overs: ${event.data.overs}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Player6SSEComponent;
