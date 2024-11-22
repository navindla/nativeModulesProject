/// set myFinal list frm wss ///





import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MyFinalScreen = () => {
  const [myFinal, setMyFinal] = useState([]);
  const [opFinal, setopFinal] = useState([]);

  useEffect(() => {
    // Create the WebSocket connection
    const ws = new WebSocket('wss://qaws.player6sports.com/191/gameEvents/5832');

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        // Extract `myFinal` and update the state opFinal
        const finalData = parsedData.data?.myFinal;
        const finalData2 = parsedData.data?.opFinal;
        if (finalData) {
          setMyFinal(finalData); // Update the state with myFinal data
          setopFinal(finalData2)
          console.log('---final data----', finalData)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Render `myFinal` on the screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Final Data:</Text>
      {myFinal.length > 0 ? (
        <FlatList
          data={myFinal}
          keyExtractor={(item, index) => `${item.draftId}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>Player ID: {item.playerId}</Text>
              <Text>Player Role: {item.playerRole}</Text>
              <Text>Order: {item.playerOrder}</Text>
            </View>
          )}
        />


        
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default MyFinalScreen;
