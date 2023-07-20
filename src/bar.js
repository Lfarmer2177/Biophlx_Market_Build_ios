import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressMeter = ({ value }) => {
  const [arrowPosition, setArrowPosition] = useState();

  // Calculate the position of the arrow based on the given value
  const calculateArrowPosition = () => {
    const maxPosition = 1.3; // Maximum position of the arrow
    const position = Math.min(Math.max(value, 0), maxPosition);
    return position;
  };

  // Get the color based on the arrow's position
  const getColor = () => {
    const maxPosition = 1.3;
    const position = calculateArrowPosition();
    const percentage = (position / maxPosition) * 100;

    if (percentage <= 50) {
      const green = Math.round((percentage / 50) * 255);
      return `rgb(${green}, 255, 0)`;
    } else {
      const red = Math.round(((100 - percentage) / 50) * 255);
      return `rgb(255, ${red}, 0)`;
    }
  };

  const arrowPositionStyle = {
    left: `${(calculateArrowPosition() / 1.3) * 100}%`,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progress, { backgroundColor: getColor() }]} />
      <View style={[styles.arrow, arrowPositionStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    borderRadius: 10,
    backgroundColor: 'lightgray',
    overflow: 'hidden',
  },
  progress: {
    flex: 1,
  },
  arrow: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    transform: [{ rotate: '45deg' }],
  },
});

export default ProgressMeter;