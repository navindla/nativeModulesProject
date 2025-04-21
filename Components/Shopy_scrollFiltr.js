//// horizntal scroll filter tags


import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const filterOptions = [
  'All', 'Men', 'Women', 'Kids', 'New', 'Sale',
  'Shoes', 'T-Shirts', 'Accessories', 'Brands', 
  'Winter', 'Summer', 'Party', 'Casual'
];

export default function FilterChips() {
  const [selected, setSelected] = useState('All');
  const flatListRef = useRef(null);

  const handleSelect = (item, index) => {
    setSelected(item);

    // scroll to selected index with some offset
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // 0 (left), 0.5 (center), 1 (right)
    });
  };

  const renderChip = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.chip, selected === item && styles.chipSelected]}
      onPress={() => handleSelect(item, index)}
    >
      <Text style={[styles.chipText, selected === item && styles.chipTextSelected]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={filterOptions}
        renderItem={renderChip}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        getItemLayout={(data, index) => (
          { length: 100, offset: 100 * index, index } // adjust 100 based on chip width
        )}
        initialScrollIndex={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#007bff',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
