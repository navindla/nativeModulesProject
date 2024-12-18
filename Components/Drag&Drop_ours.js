// https://github.com/fivecar/react-native-draglist
// yarn add react-native-draglist


import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DragList from 'react-native-draglist';

const SOUND_OF_SILENCE = [
  'hello',
  'darkness',
  'my',
  'old',
  'friend',
  'I',
  'have',
  'come',
  'to',
  'talk',
  'with',
  'you',
  'again',
  'because',
  'a',
  'vision',
  'softly',
  'creeping',
  'left',
  'its',
  'seeds',
];

export default function DraggableLyrics() {
  const [data, setData] = useState(SOUND_OF_SILENCE);

  function keyExtractor(str, _index) {
    return str;
  }

  function renderItem(info) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return (
      <TouchableOpacity
        key={item}
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
        style={[
          styles.listItem,
          isActive && styles.activeItem, // Highlight item while dragging
        ]}
      >
        <Text style={styles.listText}>{item}</Text>
      </TouchableOpacity>
    );
  }

  function onReordered(fromIndex, toIndex) {
    const copy = [...data];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setData(copy);
  }

  return (
    <View style={styles.container}>
      <DragList
        data={data}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  activeItem: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00838f',
  },
  listText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
});
