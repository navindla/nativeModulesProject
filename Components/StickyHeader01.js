
// sticky-header v1.0





import React, { useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
  FlatList,
  View,
  StatusBar,
} from 'react-native';

const DATA = Array.from({ length: 24 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Item ${i + 1}`,
}));

export default function App() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate scale and translateY for header shrink effect
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Animated Sticky Header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [
              //  { scale: headerScale }, // whole header size changes
                 { translateY: headerTranslateY }], // only ht of header chnges
            },
          ]}
        >
          <Text style={styles.headerText}>Sticky Header</Text>
        </Animated.View>

        {/* Animated FlatList */}
        <Animated.FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 80 }} // space for header
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10, // Android shadow
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 18,
  },
});
