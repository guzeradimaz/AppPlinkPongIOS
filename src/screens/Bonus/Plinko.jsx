import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Toast from 'react-native-toast-message';

const PlinkoSlot = ({value}) => {
  return (
    <View style={styles.slot}>
      <Text>{value}</Text>
    </View>
  );
};

const PlinkoBoard = ({setIsGettedBonus}) => {
  const [slotValues, setSlotValues] = useState([
    0,
    100,
    200,
    300,
    1,
    0,
    0,
    400,
    50,
    1000,
    1,
  ]);
  const [ballPosition, setBallPosition] = useState(-30);

  const ballAnimation = useRef(new Animated.Value(-30)).current;

  const handleDropBall = () => {
    const randomIndex = Math.floor(Math.random() * slotValues.length);
    const slotHeight = 45;
    const slotPosition = randomIndex * slotHeight;

    Animated.timing(ballAnimation, {
      toValue: slotPosition,
      duration: 1500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(async () => {
      setBallPosition(slotPosition);
      Toast.show({
        type: 'success',
        text1: `You got ${slotValues[randomIndex]}! Enjoy it again in 24 hours`,
      });
      const currentScore = await AsyncStorage.getItem('Score');
      const newScore = Number(currentScore) + Number(slotValues[randomIndex]);
      await AsyncStorage.setItem('Score', newScore.toString());
      setIsGettedBonus(true);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.slots}>
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [
                {
                  translateY: ballAnimation,
                },
              ],
            },
          ]}
        />
        {slotValues.map((value, index) => (
          <PlinkoSlot key={index} value={value} />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleDropBall}>
        <Text
          style={{
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontWeight: 'bold',
            fontSize: 20,
            color: '#faf55f',
          }}
        >
          Drop ball
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slots: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
  },
  slot: {
    width: 110,
    height: 40,
    borderWidth: 1,
    backgroundColor: 'red',
    alignItems: 'left',
    paddingLeft: 10,
    justifyContent: 'center',
    marginVertical: 2,
    borderColor: '#faf55f',
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#faf55f',
  },
  ball: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    top: 0,
    alignSelf: 'center',
    zIndex: 1000,
  },
});

export default PlinkoBoard;
