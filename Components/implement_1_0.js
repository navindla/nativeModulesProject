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



////////////////////////////// gpt code below ////////////////////////////////////////////////



import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { WebSocket } from 'react-native-websocket'; // Use a compatible WebSocket package

const PlayerSelectionScreen = () => {
    const [myFinal, setMyFinal] = useState([]);
    const [opFinal, setOpFinal] = useState([]);
    const wsUrl = 'wss://your-websocket-url'; // Replace with your WebSocket URL

    useEffect(() => {
        // Initialize WebSocket
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (message) => {
            try {
                const { event, data } = JSON.parse(message.data);

                if (data?.myFinal && data?.opFinal) {
                    updateLists(data.myFinal, data.opFinal);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, []);

    const updateLists = useCallback((newMyFinal, newOpFinal) => {
        setMyFinal((prev) => [...prev.slice(0, 5), ...newMyFinal]); // Ensure max of 6 items
        setOpFinal((prev) => [...prev.slice(0, 5), ...newOpFinal]); // Ensure max of 6 items
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Player Selection</Text>
            <View>
                <Text style={{ fontSize: 16, marginTop: 10 }}>My Final Players:</Text>
                {myFinal.map((player, index) => (
                    <Text key={player.playerId || index}>
                        {index + 1}. Player ID: {player.playerId}, Order: {player.order}
                    </Text>
                ))}
            </View>
            <View>
                <Text style={{ fontSize: 16, marginTop: 10 }}>Opponent Final Players:</Text>
                {opFinal.map((player, index) => (
                    <Text key={player.playerId || index}>
                        {index + 1}. Player ID: {player.playerId}, Order: {player.order}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default PlayerSelectionScreen;

