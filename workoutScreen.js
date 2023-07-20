import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button,  FlatList,  Dimensions, ScrollView } from 'react-native'; // import Button component
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Collapsible from 'react-native-collapsible';
import {Biophlx2logo} from './src/Biophlx2logo.jpeg'
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenB from './src/Workout Log';
import { push, ref, set } from "firebase/database";
import { db } from './components/config'; 

/////////////////////   Bluetooth Configuration Components **DO NOT CHANGE**    //////////////////////////////
export const manager = new BleManager();
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////      Variables for the arrays that are shown on the graphs      /////////////////////////////////
let Array3 = [] //Velocity Array
let JointAArray = [] //Joint Range of Motion Array
let repArray = []  //Reps Array
let ForceArray = []  //Reps Array
let TimeArray = []  //TUT Array
////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////Graph options available in react native chart kit/////////////////////////////
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  Line
} from "react-native-chart-kit";
/////////////////////////////////////////////////////////////////////////////////////////////////////////


export default function WorkoutScreen() {
    const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState(0); //Time Under Tension
  const [message2, setMessage2] = useState(0); //Rep Velocity 
  const [message4, setMessage4] = useState(0); //Avg. Acceleration
  const [message5, setMessage5] = useState(0);  //Reps Completed
  const [message3, setMessage3] = useState(0);  //Joint Range of Motion
  const [message6, setMessage6] = useState(0);  //Avg. Joint Range of Motion
  const [message7, setMessage7] = useState(0);  //



    const [message2Prev, setMessage2Prev] = useState(0); //Velocity previous 
  const [prevMessage3, setPrevMessage3] = useState(0); //Joint Range Previous
  const [prevMessage, setPrevMessage] = useState(0); //TUT Previous
  const [prevMomentum, setPrevMomentum] = useState(0); //Momentum Previous

  const [arrowColor, setArrowColor] = useState(null); // Arrow Color Velocity 
  const [arrowColor2, setArrowColor2] = useState(null); // Arrow Color Joint Range
  const [arrowColor3, setArrowColor3] = useState(null); // Arrow Color TUT
  const [arrowColor4, setArrowColor4] = useState(null); // Arrow Color Momentum
    
  const [exclamationColor, setExclamationColor] = useState(null); // Exclamation Color

  const [selectedWeight, setSelectedWeight] = useState(0); //Weight Entry
  const [selectedReps, setSelectedReps] = useState(0); //Desired Reps Entry

  const [force, setForce] = useState(0); //Force Calculation 
  const [difference, setDifference] = useState('');
  const [difference2, setDifference2] = useState('');
  const [difference3, setDifference3] = useState('');
  const [difference4, setDifference4] = useState('');


  const sumForce = ForceArray.reduce((total, value) => total + value, 0);
    const Forceaverage = Math.round(sumForce / ForceArray.length);
    const TUTtotal = TimeArray.reduce((total, value) => total + value, 0);
    const TUTAvg = (TUTtotal / TimeArray.length).toFixed(2);
    

    const numberRange = [...Array(101).keys()].slice(1);
  const weightRange = [...Array(101).keys()].slice(1).map(n => n * 5);

 ///////////////////////        Bluetooth Button UseEffects and UseStates        /////////////////////////////////
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  const [isOptionsCollapsed, setIsOptionsCollapsed] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsed2, setCollapsed2] = useState(true);
  const [collapsed3, setCollapsed3] = useState(true); 

  const navigation = useNavigation();

  const [workoutData, setWorkoutData] = useState([]);

  const [currentDate, setCurrentDate] = useState('');
  

//////////////////////////     Bluetooth Execution Code **DO NOT CHANGE**        ////////////////////////////////
  const scanAndConnect = () => {
    console.log("I am Pushed")
    //const manager = new BleManager();
    manager.startDeviceScan(null, null, (error, device) => {
      console.log("starting Scan")
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("There is some error")
            //console.log(error)
            //console.log(device)
            console.log(JSON.stringify(error));
            //manager.stopDeviceScan();
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
         if (device.name === 'ESP32 Device') {
    manager.stopDeviceScan();
    console.log("Successfully connected");
    connectDevice(device);
  }
});

setTimeout(() => {
  manager.stopDeviceScan();
}, 10000);

  }

 
  async function disconnectDevice() {
      console.log('Disconnecting start');
  
      if (connectedDevice != null) {
  const isDeviceConnected = await connectedDevice.isConnected();
  if (isDeviceConnected) {
    manager.cancelTransaction('messagetransaction');
    manager.cancelTransaction('nightmodetransaction');

    manager.cancelDeviceConnection(connectedDevice.id).then(() =>
      console.log('DC completed'),
    );
  }

 
  
        const connectionStatus = await connectedDevice.isConnected();
        if (!connectionStatus) {
          setIsConnected(false);
        }
      }
    }

      async function connectDevice(device) {
      console.log('connecting to Device:', device.name);
  
      device
        .connect()
        .then(device => {
          setConnectedDevice(device);
          setIsConnected(true);
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(device => {
          //  Set what to do when DC is detected
          manager.onDeviceDisconnected(device.id, (error, device) => {
            console.log(device.name, ' is DC');
            setIsConnected(false);
          });
  

          device
            .readCharacteristicForService(serviceUUID, characteristicUUID)
            .then(valenc => {
              ///////////////////Translate JSON values from the device to React components////////////////////////
              const json = JSON.parse(base64.decode(characteristic.value));
               setMessage(Number(json.value1));
              setMessage2(Number(json.value2));
              setMessage3(Number(json.value3));
              setMessage4(Number(json.value4));
              setMessage5(Number(json.value5));
              setMessage6(Number(json.value6));

              
             
              
            });

          //monitor values and tell what to do when receiving an update
          //Message
          device.monitorCharacteristicForService(
            serviceUUID,
            characteristicUUID,
            (error, characteristic) => {
              if(error){
                console.log(error)
              }
              else if (characteristic?.value != null) {
                const json = JSON.parse(base64.decode(characteristic.value));
              setMessage(Number(json.value1));
              setMessage2(Number(json.value2));
              setMessage3(Number(json.value3));
              setMessage4(Number(json.value4));
              setMessage5(Number(json.value5));
              setMessage6(Number(json.value6));

                
              }

              else {
                console.log("I dont know why I am here")
              }
            },
            'messagetransaction',
          );
          console.log('Connection established');
        });   
    }

  useEffect(() => {
    console.log('connectedDevice:', connectedDevice);
  }, [connectedDevice]);

  const sendMessage = (message) => {
    const base64Message = base64.encode(message);
    connectedDevice.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Message)
      .then(() => {
        console.log('Message sent:', message);
      })
      .catch((error) => {
        console.log('Failed to send message:', error);
      });
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
/////////////////////////////////     Force Exerted Calculations with each Rep      //////////////////////////////
useEffect(() => {

       const result = Math.round(message2 * (selectedWeight));
       
       setForce(result);
      
      
    }, [message5, selectedWeight])

    const filteredData = ForceArray.filter(value => value !== 0);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////      FILTER ANY NAN/ERROR VALUES RECEIVED    /////////////////////////////////
    useEffect(() => {
  if (message2 !== null && !isNaN(message2)) {
    Array3.push(message2);  // Velocity Array
  }
  if (message3 !== null && !isNaN(message3)) {
    JointAArray.push(message3);  // Joint Array
  }
  if (message5 !== null && !isNaN(message5)) {
    repArray.push(message5);
  }
  if (!isNaN(force)) {
    ForceArray.push(force);
  }
  if (message !== null && !isNaN(message)) {
    TimeArray.push(message);
  }

  console.log({ Array3 });
  console.log({ JointAArray });
  console.log({ repArray });
  console.log({ ForceArray });
  console.log({ TimeArray });
}, [message5]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////     Reset Graph Data       ///////////////////////////////////////////////
    const clearArray = () => {
  Array3 = [];
  repArray = [];
  JointAArray = [];
  ForceArray = [];
  TimeArray = [];
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////// START/STOP Button for Workout ///////////////////////////
const [isRunning, setIsRunning] = useState(false);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
    const command = isRunning ? '0' : '1';
  sendMessage(command);

 
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////  USER EXERCISE SELECTION /////////////////////////////////////
  const radioOptions = [

    { label: 'Barbell Squat', value: 'option6' },
    { label: 'Barbell Benchpress', value: 'option7' },
    { label: 'Deadlift', value: 'option8' },
    { label: 'Push-Up', value: 'option9' },
    { label: 'Barbell Overhead Press', value: 'option10' },

  ];

const handleOptionSelect = (value) => {
  setSelectedOption(value);
  
};

const StringOptionSend = () => {
  const selectedOptionString = JSON.stringify(selectedOption);
  sendMessage(selectedOptionString);

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   const toggleOptionsCollapse = () => {
    setIsOptionsCollapsed(!isOptionsCollapsed);
  };

    const [tableData, setTableData] = useState([]);

  // Function to handle appending new rows to the table
  useEffect(() => {
     const newRow = {
      exercise: selectedOption,
      avgForce: Forceaverage,
      avgJointRange: message3,
      avgAcceleration: message4,
      reps: message5,
      totalForce: sumForce,
    };
    
    const existingRow = tableData.find(row => row.exercise === selectedOption);
    if (existingRow) {
      // Update existing row if exercise already exists in the table
      setTableData(prevData =>
        prevData.map(row => (row.exercise === selectedOption ? newRow : row))
      );
    } else {
      // Add new row if exercise doesn't exist in the table
      setTableData(prevData => [...prevData, newRow]);
    }
  }, [selectedOption,message5])

    const getLabelForOption = value => {
    const selected = radioOptions.find(option => option.value === value);
    return selected ? selected.label : '';
  };


  ///////////////////////////////      ARROW FEEDBACK BASED ON PREVIOUS REP    /////////////////////////////////
  useEffect(() => {
  if (message2 > message2Prev) {
      setArrowColor('green');
    } else if (message2 < message2Prev) {
      setArrowColor('yellow');
    }

    // Exclamation Color
    if (message2 <= 0.4 * message2Prev) {
      setExclamationColor('purple');
    }
    if (message2 && message2Prev) {
    const diff = (message2 - message2Prev).toFixed(2);
    setDifference(diff);
  }

    setMessage2Prev(message2);

if (message3 > prevMessage3) {
      setArrowColor2('green');
    } else if (message3 < prevMessage3) {
      setArrowColor2('yellow');
    }

    // Exclamation Color
    if (message3 <= 0.4 * prevMessage3) {
      setExclamationColor('purple');
    }
    if (message3 && prevMessage3) {
    const diff2 = (message3 - prevMessage3);
    setDifference2(diff2);
  }

    setPrevMessage3(message3);


    if (message > prevMessage) {
      setArrowColor3('green');
    } else if (message < prevMessage) {
      setArrowColor3('yellow');
    }

    // Exclamation Color
    if (message <= 0.4 * prevMessage) {
      setExclamationColor('purple');
    }
    if (message && prevMessage) {
    const diff3 = (message - prevMessage).toFixed(2);
    setDifference3(diff3);
  }

    setPrevMessage(message);

    if (force > prevMomentum) {
      setArrowColor4('green');
    } else if (force < prevMomentum) {
      setArrowColor4('yellow');
    }

    // Exclamation Color
    if (force <= 0.4 * prevMomentum) {
      setExclamationColor('purple');
    }
    if (force && prevMomentum) {
    const diff4 = (force - prevMomentum);
    setDifference4(diff4);
  }

    setPrevMomentum(force);

}, [message5]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


 useEffect(() => {
    const currentDate = new Date().toLocaleDateString();
    setCurrentDate(currentDate);
  }, []);

  //////////////////////   DATA BEING SUBMITTED TO FIREBASE DATABASE WHEN 'SUBMIT' IS PRESSED   ////////////
const submitWorkout = () => {
  const newWorkoutData = {
    selectedOptionLabel: getLabelForOption(selectedOption),
    Reps: message5,
    AvgVelocity: message4,
    Forceaverage: Forceaverage,
    TUTAvg: TUTAvg,
    AvgJointRange: message6,
    AvgMomentum: Forceaverage,
    WeightLifted: selectedWeight,
  };

  setWorkoutData(prevData => [...prevData, newWorkoutData]);

  // Create a new entry in the Firebase database
  const newEntryKey = push(ref(db, 'workouts')).key;
  set(ref(db, 'workouts/' + newEntryKey), {
    WorkoutDate: currentDate,
    selectedOptionLabel: getLabelForOption(selectedOption),
    Reps: message5,
    AvgVelocity: message4,
    Forceaverage: Forceaverage,
    TUTAvg: TUTAvg,
    AvgJointRange: message6,
    AvgMomentum: Forceaverage,
    WeightLifted: selectedWeight,
  });
  navigation.navigate('ScreenB');  ////////////NAVIGATES TO WORKOUT LOG
  navigation.navigate('ScreenB', { workoutData });  ////////////NAVIGATES TO WORKOUT LOG

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////  REMOVE LAST DATA SUBMITTED TO FIREBASE DATABASE /////////////////////////////////
const removeWorkout = () => {
  const newWorkoutData = {
    WorkoutDate: currentDate,
    selectedOptionLabel: getLabelForOption(selectedOption),
    Reps: message5,
    AvgVelocity: message4,
    Forceaverage: Forceaverage,
    TUTAvg: TUTAvg,
    AvgJointRange: message6,
    WeightLifted: selectedWeight,
  };

  // Remove the last data pushed to the workoutData array
  const updatedWorkoutData = workoutData.slice(0, -2);

  setWorkoutData([...updatedWorkoutData, newWorkoutData]);

  navigation.navigate('ScreenB', { workoutData: updatedWorkoutData });  ////////////NAVIGATES TO WORKOUT LOG
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// function create () {

//        // const newKey = push(child(ref(database), 'users')).key;
//       set(ref(db, 'exercise/' + getLabelForOption(selectedOption)), {
//     DateLifted: currentDate,
//     exercise: getLabelForOption(selectedOption),
//     weight: selectedWeight,
//     Reps: message5,
//     AvgVelocity: message4,
//     AvgMomentum: Forceaverage,
//     AvgTUT: TUTAvg,
//     //profile_picture : imageUrl
//   }).then(() => {
//     alert('data updated')
//   })
//    .catch((error) => {
//     alert(error);
//    })

//   }

//   function readData() {

//     const starCountRef = ref(db, 'exercise/' + getLabelForOption(selectedOption));
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();

//   setEmail(data.email);

// });

//   }

  // function deleteData() {

  //   remove(ref(db, 'users/' + username));
  //   alert('removed')

  // }



  return (
    <View style={{ ...styles.container, marginTop: 10 }}>
    <Image
      source={Biophlx2logo}
      style={{ width: 700, height: 60, resizeMode: 'contain' }}
    />

    

    <ScrollView>
     
      
      <View style={styles.boxConnect}>
        <TouchableOpacity style={styles.connectButton}>
        {!isConnected ? (
          <Button
            title="Connect"
            onPress={() => {
              scanAndConnect();
            }}
            disabled={false}
          />
        ) : (
          <Button
            title="Disconnect"
            onPress={() => {
              disconnectDevice();
            }}
            disabled={false}
          />
        )}
      
      
    </TouchableOpacity>
    </View>
    <View style={styles.box}>
    <Button title={isOptionsCollapsed ? 'Select Exercise' : 'Hide Options'} onPress={toggleOptionsCollapse} />
      <Button title="Confirm Workout" onPress={StringOptionSend} />
      <Collapsible collapsed={isOptionsCollapsed}>
      
      <RadioForm formHorizontal={false} animation={true}>
        {radioOptions.map((option, index) => (
          <RadioButton labelHorizontal={true} key={index}>
            <RadioButtonInput
              obj={option}
              index={index}
              isSelected={selectedOption === option.value}
              onPress={handleOptionSelect}
              borderWidth={1}
              buttonInnerColor={'#e74c3c'}
              buttonOuterColor={selectedOption === option.value ? '#e74c3c' : '#000'}
              buttonSize={12}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <RadioButtonLabel
              obj={option}
              index={index}
              labelHorizontal={true}
              onPress={handleOptionSelect}
              labelStyle={{ fontSize: 16, color: '#000' }}
              labelWrapStyle={{}}
            />
          </RadioButton>
        ))}
      </RadioForm>
      <View style={[styles.container3, { marginTop: 1 }]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Weight and Reps Selection</Text>
            <Text style={styles.headerButton} onPress={() => setCollapsed(!collapsed)}>
              {collapsed ? '+' : '-'}
            </Text>
          </View> 
  
          
        </View>
        <Collapsible collapsed={collapsed}>
      <View style={[styles.box2, { height: Dimensions.get('window').height * 0.15 }]}>

      <View style={styles.pickerWrapper}>
        <Text style={styles.label2}>Weight Lifted (lbs):</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedWeight}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedWeight(itemValue);
            setSelectedWeight(itemValue.toString());
          }}
        >
          {weightRange.map(num => (
            <Picker.Item key={num} label={num.toString()} value={num} />
          ))}
        </Picker>
        <Text style={styles.selectedValue}>{selectedWeight}</Text>
      </View>
    </View>
    
    </Collapsible>
       </Collapsible>
       </View>

             <View style={styles.box}>
      <Text style={styles.dataText}>Exercise Performed is: {getLabelForOption(selectedOption)} </Text>
      <Text style={styles.dataText}>Weight Lifted is: {selectedWeight} lbs </Text>
    </View>
       

    <Button
        title={isRunning ? 'Stop' : 'Start'}
        onPress={toggleRunning}
      />


      

       
        
            <View style={styles.container_summary}>
            {/* Row 1 */}
            <View style={styles.row}>
              {/* Section 1: Radial Graph */}
              <View style={[styles.section, styles.row1Col1]}>
              <Text style={styles.dataTextHeader2}>Reps Completed</Text>
                <Text style={styles.dataText2}>{message5}</Text>
              </View>

              {/* Section 2 */}
              
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              {/* Section 3 */}
              <View style={[styles.section, styles.row2Col1]}>
              <Text style={styles.dataTextHeader2}>Avg. Velocity</Text>
                <Text style={styles.dataText2}>{message4}</Text>
              </View>

              {/* Section 4 */}
              <View style={[styles.section, styles.row2Col2]}>
              <Text style={styles.dataTextHeader2}>Rep Velocity</Text>
        <Text style={styles.dataText2}>{message2} m/s</Text>
        {arrowColor && (
          <Text style={[styles.arrowText, { color: arrowColor }]}>{arrowColor === 'green' ? '↑' : '↓'}</Text>
          
        )}
         {<Text>{difference} </Text> && <Text style={styles.diffText}>{difference} m/s</Text>}
              </View>
            </View>

            {/* Row 3*/}
            <View style={styles.row}>
              {/* Section 5 */}
              <View style={[styles.section, styles.row3Col1]}>
              <Text style={styles.dataTextHeader2}>Avg. Momentum/Rep</Text>
                <Text style={styles.dataText2}>{Forceaverage}</Text>
              </View>

              {/* Section 6 */}
              <View style={[styles.section, styles.row3Col2]}>
              <Text style={styles.dataTextHeader2}>Momentum</Text>
                <Text style={styles.dataText2}>{force}lbf/s</Text>
                 {arrowColor4 && (
          <Text style={[styles.arrowText, { color: arrowColor4 }]}>{arrowColor4 === 'green' ? '↑' : '↓'}</Text>
          
        )}
         {<Text>{difference4} </Text> && <Text style={styles.diffText}>{difference4} lb·ft/s</Text>}
              </View>
            </View>

            {/* Row 4*/}
            <View style={styles.row}>
              

              {/* Section 8 */}
              <View style={[styles.section, styles.row4Col1]}>
                <Text style={styles.dataTextHeader2}>Avg. Time Under Tension</Text>
                <Text style={styles.dataText2}>{TUTAvg}</Text>
              </View>

              {/* Section 7 */}
              <View style={[styles.section, styles.row4Col2]}>
              <Text style={styles.dataTextHeader2}>Time Under Tension</Text>
                <Text style={styles.dataText2}>{message}s</Text>
              {arrowColor3 && (
                  <Text style={[styles.arrowText, { color: arrowColor3 }]}>{arrowColor3 === 'green' ? '↑' : '↓'}</Text>
                  
                )}
                {<Text>{difference3} </Text> && <Text style={styles.diffText}>{difference3}s</Text>}
              </View>
            </View>

            {/* Row 5*/}
            <View style={styles.row}>
              

              {/* Section 10 */}
              <View style={[styles.section, styles.row5Col1]}>
              <Text style={styles.dataTextHeader2}>Avg. Joint Range of Motion</Text>
                <Text style={styles.dataText2}>{message6}</Text>
              </View>

              {/* Section 9 */}
              <View style={[styles.section, styles.row5Col2]}>
                <Text style={styles.dataTextHeader2}>Joint Range of Motion</Text>
                  <Text style={styles.dataText2}>{message3}°</Text>
                      {arrowColor2 && (
                      <Text style={[styles.arrowText, { color: arrowColor2 }]}>{arrowColor2 === 'green' ? '↑' : '↓'}
                      </Text>
                      
                    )}
                      {<Text>{difference2} </Text>&& <Text style={styles.diffText}>{difference2} °</Text>}
              </View>
            </View>
            </View>
        
        <View>

        </View>

            {/* Collapsible Section3 */}
<View style={[styles.container3, { marginTop: 1 }]}>
  <View style={styles.header}>
    <Text style={styles.headerText}>Graph Summary</Text>
    <Text style={[styles.headerButton, { marginLeft: 1 }]} onPress={() => setCollapsed3(!collapsed3)}>
      {collapsed3 ? '+' : '-'}
    </Text>
  </View>
</View>

  <Collapsible collapsed={collapsed3}>
    <View style={styles.box}>
    <Text style={styles.text3}>Momentum Exerted</Text>
    <View style={styles.barChartBox}>
    <BarChart
      data={{
        labels: [...Array(repArray)].map((_, i) => `Rep ${i + 1}`),
        datasets: [
          {
            data: filteredData.slice(0, message5),
          },
        ],
      }}
      width={Dimensions.get('window').width - 30}
      height={200}
      yAxisSuffix="lb·ft/s"
      yAxisInterval={1}
      chartConfig={{
        backgroundColor: '#00FF00',
        backgroundGradientFrom: '#006400',
        backgroundGradientTo: '#00b5ff',
        decimalPlaces: 0,
        color: (opacity = 1) =>`rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        barPercentage: 0.75,
      }}
    />
    <Text style={{ ...styles.text, alignSelf: 'center' }}>Rep #{message5}</Text>
    </View>

    </View>
  
    
        <View style={styles.box}>
          <Text style={styles.text3}>Rep Velocity</Text>
          <View style={styles.barChartBox}>
            <BarChart
              data={{
                labels: [...Array(repArray)].map((_, i) => `Rep ${i+1}`),
                datasets: [
                  {
                    data: Array3.slice(0, message5)
                  }
                ]
              }}
              width={Dimensions.get("window").width - 30}
              height={200}
              yAxisSuffix="m/s"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: '#8b0000',
        backgroundGradientFrom: '#a30000',
        backgroundGradientTo: '#FFA500',

                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                barPercentage: 0.75
              }}
            />
            <Text style={{ ...styles.text, alignSelf: 'center' }}>Rep #{message5}</Text>
          </View>
          <View style={styles.box}>

        <Text style={styles.text2}>Velocity for this rep is: {message2} m/s </Text>
              
            </View>

        </View>

        {/* //Joint Range of Motion Graph// */}

        <View style={styles.box}>
          <Text style={styles.text3}>Joint Range of Motion</Text>
          <View style={styles.barChartBox}>
            <BarChart
              data={{
                labels: [...Array(repArray)].map((_, i) => `Rep ${i + 1}`),
                datasets: [
                  {
                    data: JointAArray.slice(0, message5),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 30}
              height={200}
              yAxisSuffix="°"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: '#0077be',
                backgroundGradientFrom: '#0096d6',
                backgroundGradientTo: '#00b5ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                
              }}

              bezier
            />
            
            <Text style={{ ...styles.text, alignSelf: 'center' }}>Rep #{message5}</Text>
          </View>
          <View style={styles.box}>

        <Text style={styles.text2}>Joint Range for this rep is: {message3} Degrees </Text>
              <Text style={styles.text2}>
              Time Under Tension:{' '}
              <Text style={styles.messageText}>{message} Seconds</Text>
            </Text>
            </View>
            </View>
  </Collapsible>


  <Button title="SUBMIT WORKOUT" onPress={submitWorkout} disabled={!isConnected} />
  <Button title="Remove Last Workout" onPress={removeWorkout} disabled={!isConnected} />
<Button title="Reset Data" onPress={clearArray} />


    



      
      

      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({

  statusText: {
    fontSize: 18,
    marginBottom: 20,
  },
  selectedOptionText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
    scrollViewContent: {
    flexGrow: 1
  },
  connectButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,

  },
  connectButtonText: {
    color: '#fff'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 30
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginTop: 20
  },
  boxConnect: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginTop: 20
  },
  barChartBox: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  container3: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 40, // increase font size
    fontWeight: 'bold',
    color: 'blue',
    paddingHorizontal: 10, // add padding
  },
  label2: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 0,
    alignSelf: 'center'
  },
  box2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 100,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
  text: {
  fontSize: 18,
  color: '#888',
},
tableContainer: {
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  text2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  text3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    fontSize: 24,
    marginTop: 75,
    fontWeight: 'bold',
    color: 'black',
  },
  container_summary: {
     flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    margin: 5,
  },
  row1Col1: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row1Col2: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row2Col1: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row2Col2: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row3Col1: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row3Col2: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row4Col1: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row4Col2: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row5Col1: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  row5Col2: {
    backgroundColor: '#fa1626',
    borderRadius: 10,
  },
  radialGraphText: {
    fontSize: 48, // Adjust the font size as needed
    color: '#ad000c',
  },
  dataText: {
    fontSize: 24, // Adjust the font size as needed
    color: '#ad000c',
  },
  dataTextHeader: {
    fontSize: 18, // Adjust the font size as needed
    color: '#ad000c',
    fontWeight: 'bold',
  },
  dataText2: {
    fontSize: 30, // Adjust the font size as needed
    color: '#fff',
  },
  dataTextHeader2: {
    fontSize: 18, // Adjust the font size as needed
    color: '#fff',
    fontWeight: 'bold',
  },
  arrowText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diffText: {
    marginLeft: 5,
    fontSize: 18,
  },
});


