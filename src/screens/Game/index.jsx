import React, {useState} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GameLogic} from './components/GameLogic';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Game = ({route}) => {
  const {type} = route.params;
  const [currentBack, setCurrentBack] = useState(null);
  const getBackground = async () => {
    const data = await AsyncStorage.getItem('Background');
    if (data === null) {
      const currBack =
        'https://img.freepik.com/free-vector/city-landmarks-background-video-conferencing_23-2148617734.jpg?t=st=1708350788~exp=1708351388~hmac=a4a6db3defc3878165602ef47724c15acedcca8378acce7f052063850c03bab9';
      setCurrentBack(currBack);
    } else setCurrentBack(data);
  };
  useFocusEffect(
    React.useCallback(() => {
      getBackground();
    }, []),
  );

  return (
    <ImageBackground
      source={{uri: currentBack}}
      resizeMode="cover"
      style={{flex: 1, backgroundColor: '#fff'}}
    >
      <GestureHandlerRootView style={styles.container}>
        <GameLogic gameType={type} />
      </GestureHandlerRootView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
