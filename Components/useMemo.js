

import React, { useMemo, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const UseMemoExample = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6]);
  // 2. this arrary modiifys when Button title="Add Random Number" is clicked.

  const [count, setCount] = useState(0);


  // useMemo will only recompute when "numbers" changes
  const evenNumbers = useMemo(() => {
    console.log('Filtering even numbers...');
    return numbers.filter(num => num % 2 === 0);
  }, [numbers]);
  // 1.is not a btn press function & is not assigned to any click events.
  // 



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Even Numbers</Text>
      <FlatList
        data={evenNumbers}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text style={styles.number}>{item}</Text>}
      />

      <Button title="Add Random Number" onPress={() => {
        const newNumber = Math.floor(Math.random() * 100);
        setNumbers([...numbers, newNumber]);
      }} />

      <Button title="Re-render (increment count)" onPress={() => setCount(count + 1)} />
        {/* this btn Performs the component to re-render wantedly to test if 'evenNumbers' is trigering or not */}

      <Text style={styles.counter}>Render Count: {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  number: { fontSize: 18, marginVertical: 4 },
  counter: { marginTop: 10, fontSize: 16, color: 'gray' },
});

export default UseMemoExample;
