// loads with imgs, auto play, perfct dot indicarion


import React, { useState } from 'react';
import { Dimensions, Text, View, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const data = [
  'https://media.geeksforgeeks.org/wp-content/uploads/20240306153044/Unity-Books-For-Game-Development.webp',
  'https://media.geeksforgeeks.org/wp-content/uploads/20240306152952/What-is-Vizard-AI-and-How-to-Use-it-(1).webp',
  'https://media.geeksforgeeks.org/wp-content/uploads/20240306150928/community-marketplace.jpg',
  'https://picsum.photos/1440/2842?random=1',
  'https://picsum.photos/1440/2842?random=2',
  'https://picsum.photos/1440/2842?random=3'
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  return (
    <View style={styles.container} id="carousel-component" dataSet={{ kind: "basic-layouts", name: "parallax" }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={data}
        mode= "parallax"
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => {
          setCurrentIndex(index);
          console.log('Current index:', index);
        }}
        renderItem={({ index }) => (
          <View style={styles.item}>
            <Image 
              source={{ uri: data[index] }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          </View>
        )}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: 'black',
  },
});

export default App;
