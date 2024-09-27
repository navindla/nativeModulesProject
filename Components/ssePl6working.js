

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

const Player6SSEComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const xhr = new XMLHttpRequest();

    // Open a connection to the new SSE endpoint
    xhr.open('GET', 'https://apiqa.player6sports.com/1.0/auth/User/191/watchEvents', true);
    xhr.setRequestHeader('Accept', 'text/event-stream');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Connection', 'keep-alive');

    // Event listener for receiving SSE data
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.LOADING) {
        // Break the response into lines
        const lines = xhr.responseText.split('\n');
        let currentEvent = '';

        lines.forEach((line) => {
          // Handle 'event' lines to capture event types
          if (line.startsWith('event: ')) {
            currentEvent = line.replace('event: ', '').trim();
          }

          // Handle 'data' lines and parse them accordingly
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.replace('data: ', ''));

              // Store event type and data
              setEvents((prevEvents) => [
                ...prevEvents,
                { event: currentEvent, data: eventData },
              ]);
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        });
      }
    };

    // Send the request to establish the connection
    xhr.send();

    // Cleanup: close the connection when the component unmounts
    return () => {
      xhr.abort();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>SSE Events from Player6</Text>
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

