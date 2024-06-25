import React, {useState} from 'react';
import {Dimensions, ImageBackground, SafeAreaView, View} from 'react-native';
import {Button} from './components/Button';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScoreMainScreen} from './components/ScoreMainScreen';
import {BACKGROUNDS} from '../../assets/backs';
import {RotatedScrn, getLandscape} from './RotatedScrn';

export const Home = ({route}) => {
  const {newScore} = route.params;
  const nav = useNavigation();
  const handleStart = () => nav.navigate('Levels');
  const handleShop = () => nav.navigate('Shop');
  const handleBonus = () => nav.navigate('Bonus');
  const [score, setScore] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(null);

  const getInitData = async () => {
    let backgroundsFromStorage = await AsyncStorage.getItem('Backgrounds');
    if (backgroundsFromStorage === null) {
      await AsyncStorage.setItem('Backgrounds', JSON.stringify(BACKGROUNDS));
    }
    const backgroundFromStorage = await AsyncStorage.getItem('Background');
    if (backgroundFromStorage === null) {
      const currBack =
        'https://img.freepik.com/free-vector/city-landmarks-background-video-conferencing_23-2148617734.jpg?t=st=1708350788~exp=1708351388~hmac=a4a6db3defc3878165602ef47724c15acedcca8378acce7f052063850c03bab9';
      setCurrentBackground(currBack);
    } else setCurrentBackground(backgroundFromStorage);
    if (newScore !== null && newScore !== 0) {
      setScore(newScore);
      return null;
    }
    const scoreFromStorage = await AsyncStorage.getItem('Score');
    if (scoreFromStorage !== null) {
      const parsedScore = parseInt(scoreFromStorage, 10);
      if (parsedScore == 0) {
        return null;
      } else setScore(parsedScore);
    } else {
      return null;
    }
  };

  const [rotate, setRotate] = useState(getLandscape());

  useFocusEffect(
    React.useCallback(() => {
      getInitData();
      Dimensions.addEventListener('change', () => setRotate(getLandscape()));
    }, []),
  );

  if (rotate === 'landscape') {
    return <RotatedScrn />;
  }
  return (
    <ImageBackground source={{uri: currentBackground}} style={{flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <ScoreMainScreen currentBackground={currentBackground} score={score} />
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            minHeight: 300,
            width: '100%',
          }}
        >
          <Button onPress={handleStart} text={'start'} />
          <Button onPress={handleShop} text={'shop'} />
          <Button onPress={handleBonus} text={'get bonus'} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
