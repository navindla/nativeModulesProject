// loads with imgs, auto play, perfct dot indicarion, fixed sizes imgs


import React, { useState } from 'react';
import { Dimensions, Text, View, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const data = [
  'https://assets.ajio.com/cms/AJIO/WEB/d-1.0-UHP-14122024-MainBanners-Z1-P2-montecarlo-min30.jpg',
  'https://assets.ajio.com/cms/AJIO/WEB/d-1.0-UHP-14122024-MainBanners-Z1-P3-m&s-gap-min50.jpg',
  'https://assets.ajio.com/cms/AJIO/WEB/D-1.0-UHP-13122024-mainbanner-z1-p-trends-50to70.jpg',

];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  return (
    <View style={styles.container} id="carousel-component" dataSet={{ kind: "basic-layouts", name: "parallax" }}>
      <Carousel
        loop
        width={490}
        height={width / 2}
        autoPlay={true}
        data={data}
        mode= "parallax"
        scrollAnimationDuration={2000}
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
    width: '110%',
    height: '110%',
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
