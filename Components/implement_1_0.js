import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { WebSocket } from 'ws'; // Ensure you have a WebSocket library installed

const PlayerSelectionScreen = () => {
    const [myFinal, setMyFinal] = useState([]);
    const [opFinal, setOpFinal] = useState([]);

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new WebSocket('ws://your-websocket-url');

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            const { event: eventType, data } = JSON.parse(event.data);
            handleWebSocketMessage(eventType, data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close(); // Clean up on unmount
        };
    }, []);

    const handleWebSocketMessage = (eventType, data) => {
        // Check if the event type is within the expected range
        const eventNumber = parseInt(eventType.split('-')[0]);
        if (eventNumber >= 1 && eventNumber <= 6) {
            // Update myFinal and opFinal based on the received data
            setMyFinal(prevMyFinal => [...prevMyFinal, ...data.myFinal]);
            setOpFinal(prevOpFinal => [...prevOpFinal, ...data.opFinal]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Player Selection</Text>
            <Text style={styles.subtitle}>My Final Players:</Text>
            <FlatList
                data={myFinal}
                keyExtractor={(item) => item.playerId.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.playerItem}>{`Player ID: ${item.playerId}, Order: ${item.order}`}</Text>
                )}
            />
            <Text style={styles.subtitle}>Opponent Final Players:</Text>
            <FlatList
                data={opFinal}
                keyExtractor={(item) => item.playerId.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.playerItem}>{`Player ID: ${item.playerId}, Order: ${item.order}`}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
    },
    playerItem: {
        fontSize: 16,
        paddingVertical: 5,
    },
});

export default PlayerSelectionScreen;
