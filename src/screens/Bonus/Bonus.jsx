import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import {BackArrow} from '../Shop/Shop';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '../Home/components/Button';
import PlinkoBoard from './Plinko';

export const Bonus = () => {
  const nav = useNavigation();
  const handleBack = () => nav.goBack();

  const [canPressButton, setCanPressButton] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isBonus, setIsBonus] = useState(false);
  const [isGettedBonus, setIsGettedBonus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkElapsedTime();
    }, []),
  );

  const checkElapsedTime = async () => {
    const lastPressedTime = await AsyncStorage.getItem('lastPressedTime');

    if (lastPressedTime) {
      const elapsedTime = Date.now() - parseInt(lastPressedTime);
      const hoursElapsed = elapsedTime / (1000 * 60 * 60);
      if (hoursElapsed >= 24) {
        setCanPressButton(true);
        setRemainingTime(0);
      } else {
        const timeLeft = 24 - hoursElapsed;
        setRemainingTime(Math.floor(timeLeft));
        setCanPressButton(false);
        startTimer(timeLeft);
      }
    }
  };
  const startTimer = timeLeft => {
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCanPressButton(true);
        setRemainingTime(0);
      } else {
        timeLeft -= 0.01;
        setRemainingTime(timeLeft.toFixed(0));
      }
    }, 1000);
  };

  const onPressButton = async () => {
    await AsyncStorage.setItem('lastPressedTime', Date.now().toString());
    setCanPressButton(false);
    checkElapsedTime();
    setIsBonus(true);
  };
  const getHourText = hours => {
    if (hours === 1) {
      return 'hour';
    } else {
      return 'hours';
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#152c52',
      }}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {isBonus ? (
          !isGettedBonus && <PlinkoBoard setIsGettedBonus={setIsGettedBonus} />
        ) : (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 32,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: 'rgb(255, 216, 107)',
              }}
            >
              {remainingTime} {getHourText(remainingTime)} left
            </Text>
          </View>
        )}
      </View>
      <BackArrow onPress={handleBack} />
      <View style={{width: '90%', position: 'absolute', bottom: 30, right: 0}}>
        <Button
          text={
            canPressButton
              ? 'get bonus'
              : `${(+remainingTime).toFixed(0)} ${getHourText(remainingTime)}`
          }
          onPress={canPressButton ? onPressButton : () => {}}
        />
      </View>
    </View>
  );
};
