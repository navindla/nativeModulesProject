//   "react-native-url-polyfill": "^2.0.0"   
//npm i react-native-event-source
//      "react-native-event-listeners": "^1.0.7",
   // "react-native-sse": "^1.2.1",


import 'react-native-url-polyfill/auto'; // Add this at the top of your file
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, ScrollView, StyleSheet} from 'react-native';
import EventSource from 'react-native-sse';

const SSEScreen = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Final SSE URL with hardcoded user ID
    const sseURL =
      'https://apiqa.player6sports.com/1.0/auth/User/191/watchEvents';

    // Initialize EventSource with the final URL
    const es = new EventSource(sseURL);

    // Handle open event (connection established)
    es.addEventListener('open', () => {
      console.log('SSE connection opened');
    });

    // Listen for 'innScors' event and handle incoming scores
    es.addEventListener('innScors', event => {
      const parsedData = JSON.parse(event.data);
      console.log('New score data received:', parsedData);
      setScores(prevScores => [...prevScores, parsedData]); // Store the new score data
    });

    // Handle error events
    es.addEventListener('error', event => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    // Handle connection close event
    es.addEventListener('close', () => {
      console.log('SSE connection closed');
    });

    // Clean up EventSource on component unmount
    return () => {
      es.close();
      console.log('SSE connection closed by user');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.heading}>Live Match Scores</Text>
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <Text key={index} style={styles.score}>
              Match ID: {score.matchId} | Innings: {score.innings} | Runs:{' '}
              {score.runs} | Wickets: {score.wickets} | Overs: {score.overs}
            </Text>
          ))
        ) : (
          <Text style={styles.noScore}>No score updates yet...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  score: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  noScore: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default SSEScreen;
