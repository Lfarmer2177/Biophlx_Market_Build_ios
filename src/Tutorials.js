import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Image, Text } from 'react-native';

const BoxScreen = () => {
  const [searchText, setSearchText] = useState('');

  const boxes = [
    { id: 1, heading: 'Barbell Squat', imageSource: require('../Tutorialphotos/Barbellsquat.gif') },
    { id: 2, heading: 'Push-Up', imageSource: require('../Tutorialphotos/push-up.gif') },
    { id: 3, heading: 'Barbell Benchpress', imageSource: require('../Tutorialphotos/Barbell-bench-press.gif') },
    { id: 4, heading: 'Barbell Romanian Deadlift', imageSource: require('../Tutorialphotos/barbell-romanian-deadlift.gif') },
  ];

  const filteredBoxes = boxes.filter((box) =>
    box.heading.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredBoxes.map((box) => (
          <View key={box.id} style={styles.boxContainer}>
            <Text style={styles.boxHeader}>{box.heading}</Text>
            <Image source={box.imageSource} style={styles.boxImage} resizeMode="contain" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boxContainer: {
    width: '50%',
    marginBottom: 20,
    alignItems: 'center',
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boxImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
});

export default BoxScreen;