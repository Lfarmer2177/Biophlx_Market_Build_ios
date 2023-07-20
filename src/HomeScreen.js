import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Text, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');
const buttonHeight = height * 0.15;

const HomeScreen = ({ navigation }) => {
  const gotoworkoutScreen = () => {
    navigation.navigate('WorkoutScreen');
  };

  const gotoScreenB = () => {
    navigation.navigate('Workout Log');
  };

  const gotoGraphScreen = () => {
    navigation.navigate('GraphScreen');
  };

  const gotoScreen4 = () => {
    navigation.navigate('Screen4');
  };

  const gotoTutorialsScreen = () => {
    navigation.navigate('Tutorials');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.workoutNowButton]}
        onPress={gotoworkoutScreen}
      >
        <ImageBackground
          source={require('../Tutorialphotos/WorkNow.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Work Out Now</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.workoutLogButton]}
        onPress={gotoScreenB}
      >
        <ImageBackground
          source={require('../Tutorialphotos/WorkoutLog.jpeg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Workout Log</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.myMetricsButton]}
        onPress={() => navigation.navigate('My Metrics')}
      >
        <ImageBackground
          source={require('../Tutorialphotos/myMetrics.jpeg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>My Body Metrics</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.myTrainersButton]}
        onPress={gotoScreen4}
      >
        <ImageBackground
          source={require('../Tutorialphotos/Trainers.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Trainers</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.exerciseTutorialsButton]}
        onPress={gotoTutorialsScreen}
      >
        <ImageBackground
          source={require('../Tutorialphotos/TutorialWork.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Tutorials</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  button: {
    width: width,
    height: buttonHeight,
    marginBottom: 30,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 35,
    color: 'red',
  },
  workoutNowButton: {
    // Additional styles for the Workout Now button
  },
  workoutLogButton: {
    // Additional styles for the Workout Log button
  },
  myMetricsButton: {
    // Additional styles for the My Metrics button
  },
  myTrainersButton: {
    // Additional styles for the My Trainers button
  },
  exerciseTutorialsButton: {
    // Additional styles for the Exercise Tutorials button
  },
});

export default HomeScreen;