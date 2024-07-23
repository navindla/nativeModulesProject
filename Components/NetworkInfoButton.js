// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';
// import { getNetworkInfo , measureNetworkSpeed} from './NetworkInfo';

// const App = () => {
//     const [networkInfo, setNetworkInfo] = useState('');
//     const [networkSpeed, setNetworkSpeed] = useState('');

//     useEffect(() => {
//         fetchNetworkInfo();
//     }, []);

//     const fetchNetworkInfo = async () => {
//         try {
//             const info = await getNetworkInfo();
//             setNetworkInfo(info);

//             // Example URL for speed test (replace with your own server URL)
//             const speedTestUrl = 'https://v.ftcdn.net/07/28/93/21/700_F_728932189_RzOxoqOxK6kEcBWDgeq4NHV2NM6VUGC3_ST.mp4';
//             const speed = await measureNetworkSpeed(speedTestUrl);
//             setNetworkSpeed(`Speed: ${speed.toFixed(2)} Kbps`);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // const fetchNetworkInfo = async () => {
//     //     try {
//     //         const info = await getNetworkInfo();
//     //         setNetworkInfo(info);
//     //     } catch (error) {
//     //         console.error(error);
//     //     }
//     // };

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.text}>Network Info: {networkInfo}</Text>
//             <Text style={styles.text}>{networkSpeed}</Text>
//             <Button title="Refresh" onPress={fetchNetworkInfo} />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         marginBottom: 20,
//         fontSize: 18,
//     },
// });

// export default App;

import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getNetworkInfo , measureNetworkSpeed} from './NetworkInfo';

const App = () => {
    const [networkInfo, setNetworkInfo] = useState('');
    const [networkSpeed, setNetworkSpeed] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initial fetch
        fetchNetworkInfo();

        // Fetch every 3 seconds
        const interval = setInterval(() => {
            fetchNetworkInfo();
        }, 3000);

        // Cleanup function to clear interval on unmount
        return () => clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     fetchNetworkInfo();
    // }, []);

    const fetchNetworkInfo = async () => {
        setLoading(true);
        try {
            const info = await getNetworkInfo();
            setNetworkInfo(info);

            // Example URL for speed test (replace with your own server URL)
            const speedTestUrl = 'https://v.ftcdn.net/07/28/93/21/700_F_728932189_RzOxoqOxK6kEcBWDgeq4NHV2NM6VUGC3_ST.mp4';
            // const speedTestUrl = 'https://example.com/file-to-download';
            const speed = await measureNetworkSpeed(speedTestUrl);
            const speedMbps = convertKbpsToMbps(speed);
            setNetworkSpeed(`Speed: ${speedMbps.toFixed(2)} Mbps`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const convertKbpsToMbps = (kbps) => {
        return kbps / 1000; // 1 kbps = 0.001 Mbps
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Network Info</Text>
            <Text style={styles.info}>{networkInfo}</Text>
            {/* {loading ? (
                <ActivityIndicator size="small" color="#007bff" style={styles.loader} />
            ) : (
                <Text style={styles.info}>{networkSpeed}</Text>
            )} */}

            <Text style={styles.info}>{ loading? <ActivityIndicator size="small" color="#007bff" style={styles.loader} /> : networkSpeed}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchNetworkInfo}>
                <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Dark text color
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#555', // Medium text color
    },
    loader: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007bff', // Primary button color
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff', // Button text color
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;
