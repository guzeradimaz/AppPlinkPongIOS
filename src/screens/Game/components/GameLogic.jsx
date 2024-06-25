import React, {useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
  BounceIn,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Pause} from './Pause';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Obstacle from '../../../assets/obstacle.png';
import Unbreakable from '../../../assets/unbreakable.png';
import Sound from 'react-native-sound';
import Sound2 from './game.mp3';
import Sound1 from './pingPong.mp3';
import {
  music,
  musicPause,
  musicPlayPause,
  pingPong,
  pingPongPlay,
} from './Sound';

LogBox.ignoreAllLogs();
const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 10;
const BALL_WIDTH = 35;

const ScreenWidth = Dimensions.get('screen').width;
const islandDimensions = {x: 120, y: 11, w: 180, h: 37};

const normalizeVector = vector => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
};

export const GameLogic = ({gameType}) => {
  const nav = useNavigation();
  const {height, width} = useWindowDimensions();
  const playerDimensions = {
    w: width / 2,
    h: 37,
  };

  const [score, setScore] = useState(0);
  const [lifes, setLifes] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const [ballSource, setBallSource] = useState(null);
  const [platformSource, setPlatformSource] = useState(null);
  const [levelFinish, setLevelFinish] = useState(false);

  const getSources = async () => {
    const ballSource = await AsyncStorage.getItem('Ball');
    const platformSource = await AsyncStorage.getItem('Platform');
    if (ballSource !== null) setBallSource(JSON.parse(ballSource));
    if (platformSource !== null) setPlatformSource(JSON.parse(platformSource));
  };

  const [obstacles, setObstacles] = useState(
    gameType === '5 level'
      ? [
          {x: 100, y: 100, width: 15, height: 15, destroyed: false},
          {x: 200, y: 200, width: 15, height: 15, destroyed: false},
          {x: 300, y: 300, width: 15, height: 15, destroyed: false},
          {x: 300, y: 200, width: 15, height: 15, destroyed: false},
          {x: 300, y: 400, width: 15, height: 15, destroyed: false},
          {x: 120, y: 400, width: 15, height: 15, destroyed: false},
          {x: 150, y: 600, width: 15, height: 15, destroyed: false},
          {x: 340, y: 600, width: 15, height: 15, destroyed: false},
          {x: 50, y: 440, width: 15, height: 15, destroyed: false},
        ]
      : gameType === '4 level'
      ? [
          {x: 50, y: 100, width: 25, height: 25, destroyed: false},
          {x: 100, y: 100, width: 25, height: 25, destroyed: false},
          {x: 150, y: 100, width: 25, height: 25, destroyed: false},
          {x: 200, y: 100, width: 25, height: 25, destroyed: false},
          {x: 250, y: 100, width: 25, height: 25, destroyed: false},
          {x: 300, y: 100, width: 25, height: 25, destroyed: false},
          {x: 350, y: 100, width: 25, height: 25, destroyed: false},
          {x: 50, y: 130, width: 25, height: 25, destroyed: false},
          {x: 100, y: 130, width: 25, height: 25, destroyed: false},
          {x: 150, y: 130, width: 25, height: 25, destroyed: false},
          {x: 200, y: 130, width: 25, height: 25, destroyed: false},
          {x: 250, y: 130, width: 25, height: 25, destroyed: false},
          {x: 300, y: 130, width: 25, height: 25, destroyed: false},
          {x: 350, y: 130, width: 25, height: 25, destroyed: false},
          {x: 50, y: 160, width: 25, height: 25, destroyed: false},
          {x: 100, y: 160, width: 25, height: 25, destroyed: false},
          {x: 150, y: 160, width: 25, height: 25, destroyed: false},
          {x: 200, y: 160, width: 25, height: 25, destroyed: false},
          {x: 250, y: 160, width: 25, height: 25, destroyed: false},
          {x: 300, y: 160, width: 25, height: 25, destroyed: false},
          {x: 350, y: 160, width: 25, height: 25, destroyed: false},
          {x: 50, y: 190, width: 25, height: 25, destroyed: false},
          {x: 100, y: 190, width: 25, height: 25, destroyed: false},
          {x: 150, y: 190, width: 25, height: 25, destroyed: false},
          {x: 200, y: 190, width: 25, height: 25, destroyed: false},
          {x: 250, y: 190, width: 25, height: 25, destroyed: false},
          {x: 300, y: 190, width: 25, height: 25, destroyed: false},
          {x: 350, y: 190, width: 25, height: 25, destroyed: false},
          {x: 110, y: 220, width: 25, height: 25, destroyed: false},
          {x: 140, y: 220, width: 25, height: 25, destroyed: false},
          {x: 170, y: 220, width: 25, height: 25, destroyed: false},
          {x: 200, y: 220, width: 25, height: 25, destroyed: false},
          {x: 230, y: 220, width: 25, height: 25, destroyed: false},
          {x: 260, y: 220, width: 25, height: 25, destroyed: false},
          {x: 290, y: 220, width: 25, height: 25, destroyed: false},
          {x: 140, y: 250, width: 25, height: 25, destroyed: false},
          {x: 170, y: 250, width: 25, height: 25, destroyed: false},
          {x: 200, y: 250, width: 25, height: 25, destroyed: false},
          {x: 230, y: 250, width: 25, height: 25, destroyed: false},
          {x: 260, y: 250, width: 25, height: 25, destroyed: false},
          {x: 170, y: 280, width: 25, height: 25, destroyed: false},
          {x: 200, y: 280, width: 25, height: 25, destroyed: false},
          {x: 200, y: 310, width: 25, height: 25, destroyed: false},
          {x: 230, y: 280, width: 25, height: 25, destroyed: false},
        ]
      : gameType === '3 level'
      ? [
          {x: 50, y: 100, width: 25, height: 25, destroyed: false},
          {x: 50, y: 150, width: 25, height: 25, destroyed: false},
          {x: 50, y: 200, width: 25, height: 25, destroyed: false},
          {x: 50, y: 250, width: 25, height: 25, destroyed: false},
          {x: 50, y: 300, width: 25, height: 25, destroyed: false},
          {x: 50, y: 350, width: 25, height: 25, destroyed: false},
          {x: 50, y: 400, width: 25, height: 25, destroyed: false},
          {x: 50, y: 450, width: 25, height: 25, destroyed: false},
          {x: 50, y: 500, width: 25, height: 25, destroyed: false},
          {x: 50, y: 550, width: 25, height: 25, destroyed: false},
          {x: 50, y: 650, width: 25, height: 25, destroyed: false},
          {x: 50, y: 600, width: 25, height: 25, destroyed: false},
          {x: 350, y: 100, width: 25, height: 25, destroyed: false},
          {x: 350, y: 150, width: 25, height: 25, destroyed: false},
          {x: 350, y: 200, width: 25, height: 25, destroyed: false},
          {x: 350, y: 250, width: 25, height: 25, destroyed: false},
          {x: 350, y: 300, width: 25, height: 25, destroyed: false},
          {x: 350, y: 350, width: 25, height: 25, destroyed: false},
          {x: 350, y: 400, width: 25, height: 25, destroyed: false},
          {x: 350, y: 450, width: 25, height: 25, destroyed: false},
          {x: 350, y: 500, width: 25, height: 25, destroyed: false},
          {x: 350, y: 550, width: 25, height: 25, destroyed: false},
          {x: 350, y: 650, width: 25, height: 25, destroyed: false},
          {x: 350, y: 600, width: 25, height: 25, destroyed: false},
        ]
      : gameType === '2 level'
      ? [
          {x: 50, y: 100, width: 35, height: 35, destroyed: false},
          {x: 150, y: 100, width: 35, height: 35, destroyed: false},
          {x: 250, y: 100, width: 35, height: 35, destroyed: false},
          {x: 150, y: 150, width: 35, height: 35, destroyed: false},
          {x: 250, y: 150, width: 35, height: 35, destroyed: false},
          {x: 350, y: 150, width: 35, height: 35, destroyed: false},
          {x: 50, y: 200, width: 35, height: 35, destroyed: false},
          {x: 150, y: 200, width: 35, height: 35, destroyed: false},
          {x: 250, y: 200, width: 35, height: 35, destroyed: false},
          {x: 150, y: 250, width: 35, height: 35, destroyed: false},
          {x: 250, y: 250, width: 35, height: 35, destroyed: false},
          {x: 350, y: 250, width: 35, height: 35, destroyed: false},
          {x: 50, y: 300, width: 35, height: 35, destroyed: false},
          {x: 150, y: 300, width: 35, height: 35, destroyed: false},
          {x: 250, y: 300, width: 35, height: 35, destroyed: false},
          {x: 150, y: 350, width: 35, height: 35, destroyed: false},
          {x: 250, y: 350, width: 35, height: 35, destroyed: false},
          {x: 350, y: 350, width: 35, height: 35, destroyed: false},
          {x: 50, y: 400, width: 35, height: 35, destroyed: false},
          {x: 150, y: 400, width: 35, height: 35, destroyed: false},
          {x: 250, y: 400, width: 35, height: 35, destroyed: false},
          {x: 150, y: 450, width: 35, height: 35, destroyed: false},
          {x: 250, y: 450, width: 35, height: 35, destroyed: false},
          {x: 350, y: 450, width: 35, height: 35, destroyed: false},
        ]
      : gameType === '1 level'
      ? [
          {x: 75, y: 100, width: 50, height: 50, destroyed: false},
          {x: 185, y: 100, width: 50, height: 50, destroyed: false},
          {x: 300, y: 100, width: 50, height: 50, destroyed: false},
          {x: 75, y: 200, width: 50, height: 50, destroyed: false},
          {x: 185, y: 200, width: 50, height: 50, destroyed: false},
          {x: 300, y: 200, width: 50, height: 50, destroyed: false},
          {x: 75, y: 300, width: 50, height: 50, destroyed: false},
          {x: 185, y: 300, width: 50, height: 50, destroyed: false},
          {x: 300, y: 300, width: 50, height: 50, destroyed: false},
          {x: 75, y: 400, width: 50, height: 50, destroyed: false},
          {x: 185, y: 400, width: 50, height: 50, destroyed: false},
          {x: 300, y: 400, width: 50, height: 50, destroyed: false},
          {x: 75, y: 500, width: 50, height: 50, destroyed: false},
          {x: 185, y: 500, width: 50, height: 50, destroyed: false},
          {x: 300, y: 500, width: 50, height: 50, destroyed: false},
        ]
      : gameType !== 'no-obst' && gameType !== 'player-vs-comp'
      ? [
          {x: 100, y: 300, width: 50, height: 50, destroyed: false},
          {x: 250, y: 200, width: 70, height: 70, destroyed: false},
          {x: 250, y: 300, width: 70, height: 70, destroyed: false},
          {x: 220, y: 460, width: 80, height: 20, destroyed: false},
          {x: 320, y: 400, width: 20, height: 100, destroyed: false},
        ]
      : [],
  );

  const [unBreakableObstacles, setUnbreakableObstacles] = useState(
    gameType === 'more-obst'
      ? [
          {x: 20, y: 300, width: 100, height: 70},
          {x: ScreenWidth - 70, y: 300, width: 100, height: 70},
          {x: ScreenWidth / 2 - 25, y: 150, width: 100, height: 70},
        ]
      : [],
  );

  const [currentBonus, setCurrentBonus] = useState('');
  const [ballSize, setBallSize] = useState(BALL_WIDTH);
  const [ballSpeed, setBallSpeed] = useState(
    gameType === 'player-vs-comp' ? 25 : SPEED,
  );
  const [platformSize, setPlatformSize] = useState(playerDimensions.w);

  const targetPositionX = useSharedValue(width / 2);
  const targetPositionY = useSharedValue(height / 2);
  const direction = useSharedValue(
    normalizeVector({x: Math.random(), y: Math.random()}),
  );
  const playerPos = useSharedValue({x: width / 4, y: height - 100});

  music.setVolume(1);
  pingPong.setVolume(1);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (!gameOver) {
          update();
        }
      }, DELTA);
      if (!levelFinish)
        if (obstacles.every(i => i.destroyed)) {
          if (!gameOver) {
            clearInterval(interval);
            const interval = setInterval(() => {
              if (!gameOver) {
                update();
              }
            }, DELTA);
          }
        }
      return () => clearInterval(interval);
    }, [gameOver, obstacles, currentBonus, levelFinish]),
  );
  useFocusEffect(
    useCallback(() => {
      restartGame();
      getSources();
      musicPlayPause();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!levelFinish) {
        if (gameOver) {
          if (gameType === 'infinity') {
            restartGame();
          }
          if (lifes >= 1) setLifes(prev => prev - 1);
          else {
            if (gameType !== 'infinity') handlePause();
          }
        }
      }
    }, [gameOver, levelFinish]),
  );

  useEffect(() => {
    if (currentBonus === 'BALL_SIZE_INCREASE') {
      Toast.show({
        type: 'success',
        text1: 'Big Ball 🎱',
      });
      setBallSize(50);
      setTimeout(() => {
        setBallSize(BALL_WIDTH);
      }, 10000);
    } else if (currentBonus === 'BALL_SIZE_DECREASE') {
      Toast.show({
        type: 'error',
        text1: 'Small Ball 🎱',
      });
      setBallSize(20);
      setTimeout(() => {
        setBallSize(BALL_WIDTH);
      }, 10000);
    } else if (currentBonus === 'PLATFORM_SIZE_INCREASE') {
      Toast.show({
        type: 'error',
        text1: 'Small Pad ❗️',
      });
      setPlatformSize(prev => prev / 2);
      setTimeout(() => {
        setPlatformSize(playerDimensions.w);
      }, 10000);
    } else if (currentBonus === 'BALL_SPEED_DECREASE') {
      Toast.show({
        type: 'success',
        text1: 'Slow Ball ⚓️',
      });
      setBallSpeed(5);
      setTimeout(() => {
        setBallSpeed(SPEED);
      }, 10000);
    } else if (currentBonus === 'EXTRA_LIFE') {
      Toast.show({
        type: 'success',
        text1: 'EXTRA LIFE ❤️',
      });
      if (lifes < 5) setLifes(prev => prev + 1);
    }
  }, [currentBonus]);

  const generateObstacles = () => {
    if (gameType === '1 level' || gameType === '2 level') {
      setLevelFinish(true);
      return null;
    }
    const newObstacles = [];
    for (let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].destroyed) {
        const shouldHaveBonus = Math.floor(Math.random() * 10) + 1;
        let bonusType = null;

        if (shouldHaveBonus === 1) {
          bonusType = 'BALL_SIZE_INCREASE';
        } else if (shouldHaveBonus === 2) {
          bonusType = 'PLATFORM_SIZE_INCREASE';
        } else if (shouldHaveBonus === 3) {
          bonusType = 'BALL_SPEED_DECREASE';
        }
        if (gameType === 'bonus') {
          if (shouldHaveBonus === 4) {
            bonusType = 'BALL_SIZE_DECREASE';
          } else if (shouldHaveBonus === 5) {
            bonusType = 'EXTRA_LIFE';
          }
        }

        if (bonusType) {
          newObstacles.push({
            x: Math.random() * (width - 100),
            y: Math.random() * (height - 200),
            width: 50 + Math.random() * 50,
            height: 50 + Math.random() * 50,
            destroyed: false,
            bonus: bonusType, // Помечаем препятствие с типом бонуса
          });
        } else {
          newObstacles.push({
            x: Math.random() * (width - 100),
            y: Math.random() * (height - 200),
            width: 50 + Math.random() * 50,
            height: 50 + Math.random() * 50,
            destroyed: false,
            bonus: null, // Препятствие без бонуса
          });
        }
      } else {
        newObstacles.push(obstacles[i]);
      }
    }
    return newObstacles;
  };

  const update = useCallback(() => {
    if (levelFinish) {
      return null;
    }
    let nextPos = getNextPos(direction.value);
    let newDirection = direction.value;
    if (gameType !== 'no-obst') {
      obstacles.forEach(obstacle => {
        if (
          !obstacle.destroyed &&
          nextPos.x < obstacle.x + obstacle.width &&
          nextPos.x + ballSize > obstacle.x &&
          nextPos.y < obstacle.y + obstacle.height &&
          nextPos.y + ballSize > obstacle.y
        ) {
          if (obstacle.bonus) setCurrentBonus(obstacle.bonus);
          newDirection = {
            x: -direction.value.x,
            y: -direction.value.y,
          };
          obstacle.destroyed = true;
          if (ballSize === 50) setScore(s => s + 5);
          if (ballSize === 20) setScore(s => s + 0.5);
          else setScore(s => s + 1);
          direction.value = newDirection;
          nextPos = getNextPos(newDirection);
        }
      });
    }
    if (gameType === 'more-obst') {
      const maxSpeed = 2; // Максимальное значение скорости

      unBreakableObstacles.forEach(obstacle => {
        if (
          nextPos.x < obstacle.x + obstacle.width &&
          nextPos.x + ballSize > obstacle.x &&
          nextPos.y < obstacle.y + obstacle.height &&
          nextPos.y + ballSize > obstacle.y
        ) {
          // Генерируем случайное направление от -maxSpeed до maxSpeed для x и y
          const randomOffsetX = Math.random() * maxSpeed * 2 - maxSpeed;
          const randomOffsetY = Math.random() * maxSpeed * 2 - maxSpeed;

          // Добавляем случайное смещение к текущей скорости
          const newDirectionX =
            Math.max(
              Math.min(Math.abs(direction.value.x + randomOffsetX), maxSpeed),
              0.4, // Минимальная скорость, чтобы избежать остановки
            ) * Math.sign(direction.value.x + randomOffsetX);

          const newDirectionY =
            Math.max(
              Math.min(Math.abs(direction.value.y + randomOffsetY), maxSpeed),
              0.4,
            ) * Math.sign(direction.value.y + randomOffsetY);

          newDirection = {
            x: newDirectionX,
            y: newDirectionY,
          };

          direction.value = newDirection;
          nextPos = getNextPos(newDirection);
        }
      });
    }

    targetPositionX.value = withTiming(nextPos.x, {
      duration: DELTA,
      easing: Easing.linear,
    });
    targetPositionY.value = withTiming(nextPos.y, {
      duration: DELTA,
      easing: Easing.linear,
    });
    const speedLimit = 1.8;

    // Wall Hit detection
    if (nextPos.y > height - ballSize) {
      setGameOver(true);
    }
    if (nextPos.y < 0) {
      newDirection = {x: direction.value.x, y: -direction.value.y};

      // Применение ограничения скорости
      const totalSpeed = Math.abs(newDirection.x) + Math.abs(newDirection.y);
      if (totalSpeed > gameType === 'player-vs-comp' ? 2 : speedLimit) {
        // Уменьшаем скорость до предельного значения
        const scale =
          gameType === 'player-vs-comp' ? 2 : speedLimit / totalSpeed;
        newDirection.x *= scale;
        newDirection.y *= scale;
      }

      if (gameType === 'player-vs-comp') {
        setScore(prev => prev + 0.5);
      }
      direction.value = newDirection;
      nextPos = getNextPos(newDirection);
    }

    if (nextPos.x < 0 || nextPos.x > width - ballSize) {
      newDirection = {x: -direction.value.x, y: direction.value.y};

      // Применение ограничения скорости
      const totalSpeed = Math.abs(newDirection.x) + Math.abs(newDirection.y);
      if (totalSpeed > speedLimit) {
        // Уменьшаем скорость до предельного значения
        const scale = speedLimit / totalSpeed;
        newDirection.x *= scale;
        newDirection.y *= scale;
      }

      direction.value = newDirection;
      nextPos = getNextPos(newDirection);
    }

    // Island Hit detection
    if (
      nextPos.x < gameType === 'no-obst'
        ? 0
        : islandDimensions.x + gameType === 'no-obst' ||
          gameType === 'player-vs-comp'
        ? ScreenWidth + 100
        : (islandDimensions.w &&
            nextPos.x + ballSize > gameType === 'no-obst') ||
          gameType === 'player-vs-comp'
        ? 0
        : islandDimensions.x &&
          nextPos.y < islandDimensions.y + islandDimensions.h &&
          ballSize + nextPos.y > islandDimensions.y
    ) {
      if (
        targetPositionX.value < gameType === 'no-obst'
          ? 0
          : islandDimensions.x ||
            targetPositionX.value > gameType === 'no-obst' ||
            gameType === 'player-vs-comp'
          ? 0
          : islandDimensions.x + gameType === 'no-obst' ||
            gameType === 'player-vs-comp'
          ? ScreenWidth + 100
          : islandDimensions.w
      ) {
        // Применение ограничения скорости
        const totalSpeed = Math.abs(newDirection.x) + Math.abs(newDirection.y);
        if (totalSpeed > 2) {
          // Уменьшаем скорость до предельного значения
          const scale = 1.7 / totalSpeed;
          newDirection.x *= scale;
          newDirection.y *= scale;
        }

        direction.value = newDirection;
        nextPos = getNextPos(newDirection);
      } else {
        // Применение ограничения скорости
        const totalSpeed = Math.abs(newDirection.x) + Math.abs(newDirection.y);
        if (totalSpeed > 2) {
          // Уменьшаем скорость до предельного значения
          const scale = 1.7 / totalSpeed;
          newDirection.x *= scale;
          newDirection.y *= scale;
        }

        direction.value = newDirection;
        nextPos = getNextPos(newDirection);
      }

      if (gameType === 'no-obst') {
        if (ballSize === 50) setScore(s => s + 5);
        else setScore(s => s + 1);
      }
    }

    // Player Hit detection
    if (
      nextPos.x < playerPos.value.x + platformSize &&
      nextPos.x + ballSize > playerPos.value.x &&
      nextPos.y < playerPos.value.y + playerDimensions.h &&
      ballSize + nextPos.y > playerPos.value.y
    ) {
      if (
        targetPositionX.value < playerPos.value.x ||
        targetPositionX.value > playerPos.value.x + platformSize
      ) {
        pingPongPlay();
        newDirection = {x: -direction.value.x, y: direction.value.y};
      } else {
        pingPongPlay();
        newDirection = {x: direction.value.x, y: -direction.value.y};
      }
    }

    direction.value = newDirection;
    nextPos = getNextPos(newDirection);

    targetPositionX.value = withTiming(nextPos.x, {
      duration: DELTA,
      easing: Easing.linear,
    });
    targetPositionY.value = withTiming(nextPos.y, {
      duration: DELTA,
      easing: Easing.linear,
    });
  }, [obstacles, currentBonus, levelFinish]);

  const getNextPos = direction => {
    return {
      x: targetPositionX.value + direction.x * ballSpeed,
      y: targetPositionY.value + direction.y * ballSpeed,
    };
  };

  const restartGame = () => {
    targetPositionX.value = width / 2;
    targetPositionY.value = height / 2;
    setGameOver(false);
  };
  const goHome = () => {
    nav.navigate('Levels');
    musicPause();
  };

  const ballAnimatedStyles = useAnimatedStyle(() => {
    return {
      top: targetPositionY.value,
      left: targetPositionX.value,
    };
  });

  const playerAnimatedStyles = useAnimatedStyle(() => ({
    left: playerPos.value.x,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onActive: event => {
      playerPos.value = {
        ...playerPos.value,
        x: event.absoluteX - platformSize / 2,
      };
    },
  });

  const handlePause = async () => {
    try {
      const i = await AsyncStorage.getItem('Score');
      const newScore = +i + +score;
      await AsyncStorage.setItem('Score', newScore.toString());
      nav.navigate('Home', {score: newScore});
      musicPause();
    } catch (error) {
      console.error(error);
    }
  };

  const renderUnbreakable = () => {
    if (unBreakableObstacles) {
      return unBreakableObstacles.map((item, index) => {
        return (
          <Animated.Image
            source={Unbreakable}
            resizeMode="repeat"
            key={index}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
            }}
          />
        );
      });
    }
  };

  const renderObstacles = () => {
    if (gameType === 'no-obst') {
      return null;
    } else {
      if (obstacles)
        if (obstacles.every(obstacle => obstacle.destroyed)) {
          const newObstacles = generateObstacles();
          setObstacles(newObstacles);
        }
      if (obstacles)
        return obstacles.map((obstacle, index) => {
          if (!obstacle.destroyed) {
            return (
              <Animated.Image
                source={Obstacle}
                resizeMode="repeat"
                key={index}
                style={{
                  position: 'absolute',
                  left: obstacle.x,
                  top: obstacle.y,
                  width: obstacle.width,
                  height: obstacle.height,
                  backgroundColor: 'gray',
                }}
              />
            );
          } else {
            return null;
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <Pause onPress={handlePause} />
      <Text
        style={[
          styles.score,
          {
            top: gameType === 'more-obst' ? 200 : 150,
          },
        ]}
      >
        {score}
      </Text>
      {levelFinish && (gameType === '1 level' || gameType === '2 level') ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Level complete!</Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: '#000',
              borderRadius: 20,
              paddingVertical: 10,
            }}
            onPress={goHome}
          >
            <Text
              style={{
                color: 'green',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Go Home
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {gameOver && gameType !== 'infinity' && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game over</Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: '#000',
              borderRadius: 20,
              paddingVertical: 10,
            }}
            onPress={restartGame}
          >
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Restart
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {renderBalls({lifes, gameType})}
      {gameType !== 'no-obst' &&
        gameType !== 'player-vs-comp' &&
        renderObstacles()}
      {gameType === 'more-obst' && renderUnbreakable()}
      {!gameOver ? (
        ballSource ? (
          <Animated.Image
            source={ballSource}
            resizeMode={'cover'}
            style={[
              styles.ball,
              ballAnimatedStyles,
              {width: ballSize, height: ballSize},
            ]}
          />
        ) : (
          <Animated.View
            style={[
              styles.ball,
              ballAnimatedStyles,
              {width: ballSize, height: ballSize},
            ]}
          />
        )
      ) : null}

      {/* Island */}
      <Animated.View
        entering={BounceIn}
        key={score}
        style={{
          position: 'absolute',
          top: islandDimensions.y - 20,
          left:
            gameType === 'no-obst' || gameType === 'player-vs-comp'
              ? 0
              : islandDimensions.x,
          width:
            gameType === 'no-obst' || gameType === 'player-vs-comp'
              ? ScreenWidth + 100
              : islandDimensions.w + 10,
          height: islandDimensions.h + 20,
          borderRadius:
            gameType === 'no-obst' || gameType === 'player-vs-comp' ? 0 : 20,
          backgroundColor: 'black',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          zIndex: 1000,
        }}
      />

      {/* Player */}
      {platformSource ? (
        <Animated.Image
          source={platformSource}
          resizeMode={'cover'}
          entering={BounceIn}
          style={[
            {
              top: playerPos.value.y,
              position: 'absolute',
              width: gameType === 'no-obst' ? platformSize / 2.2 : platformSize,
              height: playerDimensions.h,
              borderRadius: 20,
              backgroundColor: 'black',
            },
            playerAnimatedStyles,
          ]}
        />
      ) : (
        <Animated.View
          entering={BounceIn}
          style={[
            {
              top: playerPos.value.y,
              position: 'absolute',
              width: gameType === 'no-obst' ? platformSize / 2.5 : platformSize,
              height: playerDimensions.h,
              borderRadius: 20,
              backgroundColor: 'black',
            },
            playerAnimatedStyles,
          ]}
        />
      )}

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={{
            width: '100%',
            height: 200,
            position: 'absolute',
            bottom: 0,
          }}
        />
      </PanGestureHandler>
    </View>
  );
};

const renderBalls = ({lifes, gameType}) => {
  const [arrLifes, setLifesArr] = useState([]);
  useEffect(() => {
    if (lifes) setLifesArr(Array(lifes).fill(''));
    else setLifesArr([]);
  }, [lifes]);
  if (gameType !== 'infinity')
    return (
      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 40,
          width: 35,
          height: lifes > 3 ? 130 : 80,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {arrLifes.map(i => (
          <View
            key={Math.random() + '--id'}
            style={{
              width: 25,
              backgroundColor: 'black',
              aspectRatio: 1,
              borderRadius: 25,
            }}
          />
        ))}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '111.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    backgroundColor: 'black',
    aspectRatio: 1,
    borderRadius: 25,
    position: 'absolute',
  },
  score: {
    fontSize: 150,
    fontWeight: '500',
    position: 'absolute',
    top: 150,
    color: 'lightgray',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 350,
    zIndex: 200,
  },
  gameOver: {
    fontSize: 50,
    fontWeight: '500',
    color: 'red',
  },
});
