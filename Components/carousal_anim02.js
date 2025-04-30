

import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1"
];

// Get window dimensions
const windowWidth = Dimensions.get('window').width;

function Index() {
  const progress = useSharedValue(0);

  return (
    <View id="carousel-component" dataSet={{ kind: "basic-layouts", name: "parallax" }}>
      <Carousel
        autoPlayInterval={900}
        data={defaultDataWith6Colors}
        height={258}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={windowWidth} // Use the defined window width
        style={{
          width: windowWidth,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={(_, value) => {
            progress.value = value; // Correctly using shared value
          }}
        renderItem={({ index }) => (
          <View style={[styles.item, { backgroundColor: defaultDataWith6Colors[index] }]}>
            {/* You can add more content here, like images or text */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    // Optional styles for shadow or borders
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Index;
