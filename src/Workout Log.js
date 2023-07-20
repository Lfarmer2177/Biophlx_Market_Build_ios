import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, ScrollView } from 'react-native';
import { onValue, ref } from 'firebase/database';
import { db } from '../components/config';

function ScreenB() {
  const [workoutData, setWorkoutData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = () => {
      const workoutRef = ref(db, 'workouts');
      onValue(workoutRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedData = Object.values(data);
          setWorkoutData(fetchedData);
        }
      });
    };

    fetchData();
  }, []);

  const filteredWorkoutData = workoutData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const renderTableItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.text}><Text style={styles.text2}>Exercise:</Text> {item.selectedOptionLabel}</Text>
      <Text style={styles.text}><Text style={styles.text2}>Reps:</Text> {item.Reps}</Text>
      <Text style={styles.text}><Text style={styles.text2}>Avg. Velocity:</Text> {item.AvgVelocity} m/s</Text>
      <Text style={styles.text}><Text style={styles.text2}>Avg. Momentum:</Text> {item.AvgMomentum} lbf/s</Text>
      <Text style={styles.text}><Text style={styles.text2}>TUT Avg.:</Text> {item.TUTAvg}s</Text>
      <Text style={styles.text}><Text style={styles.text2}>Avg. Joint ROM:</Text> {item.AvgJointRange}°</Text>
      <Text style={styles.text}><Text style={styles.text2}>Date:</Text> {item.WorkoutDate}</Text>
    </View>
  );

  return (
    <ScrollView horizontal>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={setSearchText}
          value={searchText}
        />
        <FlatList
          data={filteredWorkoutData}
          renderItem={renderTableItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  row: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-start', // Align items to the left
  },
  text: { margin: 10, flexWrap: 'wrap', maxWidth: 200 },
  text2: { fontWeight: 'bold', color: 'red' }, // Added text2 style for bold and red font
  button: {
    backgroundColor: '#f1f8ff',
    padding: 5,
    marginTop: 10,
    textAlign: 'left', // Align text to the left
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f1f8ff',
  },
});

export default ScreenB;