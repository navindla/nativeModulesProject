
import React from 'react';
import { View, ScrollView, StyleSheet, Animated, Text } from 'react-native';

// Custom AppBar component that receives translateY for animation
const AnimatedAppBar = ({ translateY }) => {
  return (
    <Animated.View
      style={[
        styles.appBar,
        { transform: [{ translateY }] }, // Translates the header on the Y-axis
      ]}
    >
      {/* Customize your header content here */}
      <View style={styles.headerContent}>
        {/* Example header content */}
        <Text style={styles.headerText}>Header Title</Text>
      </View>
    </Animated.View>
  );
};

export default function App() {
  // Animated value to track scroll position
  const scrollY = new Animated.Value(0);
  // Clamp the scroll value within the header height
  const diffClamp = Animated.diffClamp(scrollY, 0, 64);
  // Interpolate the clamped value to control the translation of the header
  const translateY = diffClamp.interpolate({
    inputRange: [0, 64],
    outputRange: [0, -64],
  });

  // Function to handle scrolling
  const handleScroll = (e) => {
    scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <AnimatedAppBar translateY={translateY} />
      
      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Adjusts scroll event frequency for performance
      >
        {/* Spacer to account for header height */}
        <View style={{ height: 64 }} />
        {/* Add content or list items here */}
        {Array.from({ length: 20 }, (_, i) => (
          <View key={i} style={styles.item}>
            <Text>Item {i + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'red', // Header color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 4, // Android shadow effect
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
});
