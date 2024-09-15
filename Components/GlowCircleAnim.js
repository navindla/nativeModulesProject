import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const GlowingCircle = () => {
  const [show, setShow] = React.useState(true);

  // Toggle the visibility every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShow(prev => !prev);
    }, 1000); // Change the interval as needed
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {show && (
        <Animated.View
          style={styles.circleContainer}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
        >
          <View style={styles.circle} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#000', // Optional: to enhance the glow effect
  },
  circleContainer: {
    width: 210,
    height: 210,
    borderRadius: 155,
    borderWidth: 5,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
});

export default GlowingCircle;
