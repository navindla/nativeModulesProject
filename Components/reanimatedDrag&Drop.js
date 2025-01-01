

import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export default function App() {
  const pressed = useSharedValue(false);

  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    
    })
    .onChange((event) => {
     // offset.value = event.translationX;
      // offset.value += event.changeX;
      offset.value += event.changeY;
      console.log('offset :',offset.value)
    })
    .onFinalize(() => {
      // offset.value = offset.value 
      //offset.value = withSpring(0);


      if (offset.value < -60 && offset.value > -180) {
        offset.value = withSpring(-120); // Apply spring animation to 125
      } else if(
        offset.value < -180 && offset.value > -300
      ){
        offset.value = withSpring(-240)
      }
      else if( offset.value < -300 ){
        offset.value = withSpring(-360)
      }
      else {
        offset.value = withSpring(0); // Reset to 0 otherwise
      }
      pressed.value = false;
    });
    




  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value },
      { scale: withTiming(pressed.value ? 1.1 : 1) },
    ],
    backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
  }));
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33',   '#FF33A6', '#33FFF3', '#8D33FF'];
  const segmentHeight = 100; // Height of each background-colored view

  return (
    // <GestureHandlerRootView style={styles.container}>
    //   <View style={styles.container}>
    //     <GestureDetector gesture={pan}>
    //       <Animated.View style={[styles.circle, animatedStyles]} />
    //     </GestureDetector>
    //   </View>
    // </GestureHandlerRootView>


    <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      {colors.map((color, index) => (
        <View key={index} style={[styles.segment, { backgroundColor: color, height: segmentHeight }]} />
      ))}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.circle, animatedStyles]} />
      </GestureDetector>
    </View>
  </GestureHandlerRootView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100%',
//   },
//   segment: {
//    // flex: 1,
//     width: '100%',
//   },
//   circle: {
//     height: 90,
//     width: 320,
//     backgroundColor: '#b58df1',
//     borderRadius: 10,
//     cursor: 'grab',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems:'center'
  },
  segment: {
    flex: 1,
    width: '100%',
  },
  circle: {
    height: 90,
    width: 320,
    backgroundColor: '#b58df1',
    borderRadius: 10,
    position: 'absolute', // Keeps the circle on top
  },
});
