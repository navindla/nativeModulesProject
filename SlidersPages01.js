
// dots

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

const Slide1 = () => (
  <View style={[styles.slide, { backgroundColor: '#ffadad' }]}>
    <Text style={styles.text}>Welcome to Slide 1</Text>
  </View>
);

const Slide2 = () => (
  <View style={[styles.slide, { backgroundColor: '#ffd6a5' }]}>
    <Text style={styles.text}>This is Slide 2</Text>
  </View>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1">
          <Slide1 />
        </View>
        <View key="2">
          <Slide2 />
        </View>
      </PagerView>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        <View
          style={[
            styles.dot,
            currentPage === 0 ? styles.activeDot : styles.inactiveDot,
          ]}
        />
        <View
          style={[
            styles.dot,
            currentPage === 1 ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default App;






