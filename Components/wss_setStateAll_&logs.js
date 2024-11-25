
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MyFinalScreen = () => {
  const [myFinal, setMyFinal] = useState([]);
  const [opFinal, setOpFinal] = useState([]);
  const [myStatus, setMyStatus] = useState({});
  const [opnStatus, setOpnStatus] = useState({});
  const [needToPick, setNeedToPick] = useState(false); // New state for need_to_pick

  useEffect(() => {
    // Create the WebSocket connection
    const ws = new WebSocket('wss://qaws.player6sports.com/191/gameEvents/5838');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };




// sets state all req flds

    ws.onmessage = (event) => {
      try {
        console.log('--raw-event--',event);
        const parsedData = JSON.parse(event.data);
        console.log(parsedData)

        // Extract and set the new state variables
        //  parsedData.data?.myFinal
        const myStatusData = parsedData.data?.myStatus;
        const opnStatusData = parsedData.data?.opnStatus;
        const myFinalData = parsedData.data?.myFinal;
        const opFinalData = parsedData.data?.opFinal;

        // Update the state with new data
        if (myStatusData) {
          console.log('My Status:', myStatusData);
          setMyStatus(myStatusData);
        }
        
        if (opnStatusData) {
          console.log('Opponent Status:', opnStatusData);
          setOpnStatus(opnStatusData);
        }

        if (myFinalData) {
          console.log('My Final Data:', myFinalData);
          setMyFinal(myFinalData); // Update the state with myFinal data
        }

        if (opFinalData) {
          console.log('Opponent Final Data:', opFinalData);
          setOpFinal(opFinalData); // Update the state with opFinal data
        }

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };






    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);



      // Effect to update needToPick state based on myStatus
      useEffect(() => {
        if (myStatus.need_to_pick !== undefined) {
            setNeedToPick(myStatus.need_to_pick);
        }
    }, [myStatus]);

    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Status:</Text>
      <Text>User ID: {myStatus.userId}</Text>
      <Text>Status: {myStatus.status}</Text>
      <Text>Pick: {myStatus.need_to_pick? "YES" : "NO"}</Text>
      
      <Text style={styles.title}>Opponent Status:</Text>
      <Text>User ID: {opnStatus.userId}</Text>
      <Text>Status: {opnStatus.status}</Text>
      <Text>Pick: {opnStatus.need_to_pick? "YES" : "NO"}</Text>
      <Text>Pick: {opnStatus.current_round}</Text>

      <Text style={styles.title}>My Final Data:</Text>
      {myFinal.length > 0 ? (
        <FlatList
          data={myFinal}
          keyExtractor={(item) => item.playerId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Player ID: {item.playerId}</Text>
              <Text style={styles.itemText}>Order: {item.order}</Text>
              <Text style={styles.itemText}>Start Time: {item.startTime}</Text>
              <Text style={styles.itemText}>End Time: {item.endTime}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No my final data available</Text>
      )}

      <Text style={styles.title}>Opponent Final Data:</Text>
      {opFinal.length > 0 ? (
        <FlatList
          data={opFinal}
          keyExtractor={(item) => item.playerId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Player ID: {item.playerId}</Text>
              <Text style={styles.itemText}>Order: {item.order}</Text>
              <Text style={styles.itemText}>Start Time: {item.startTime}</Text>
              <Text style={styles.itemText}>End Time: {item.endTime}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No opponent final data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text for better readability
  },
  itemContainer: {
    backgroundColor: '#ffffff', // White background for list items
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  itemText: {
    fontSize: 16,
    color: '#555', // Slightly lighter text color
  },
});

export default MyFinalScreen;
