import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {BACKGROUNDS} from '../../assets/backs';
import {BALLS, BALLS_RENDER} from '../../assets/balls';
import {PLATFORMS, PLATFORMS_RENDER} from '../../assets/platforms';

export const Shop = () => {
  const nav = useNavigation();
  const handleBack = () => nav.goBack();
  const [points, setPoints] = useState(0);
  const [background, setBackground] = useState(null);

  const [listBackgrounds, setBackgrounds] = useState([]);
  const [balls, setBalls] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const getInit = async () => {
    const backgroundsFromStorage = JSON.parse(
      await AsyncStorage.getItem('Backgrounds'),
    );
    if (backgroundsFromStorage !== null) {
      setBackgrounds(backgroundsFromStorage);
    } else if (backgroundsFromStorage === null) {
      await AsyncStorage.setItem('Backgrounds', JSON.stringify(BACKGROUNDS));
      setBackgrounds(BACKGROUNDS);
    }

    const ballsFromStorage = JSON.parse(await AsyncStorage.getItem('Balls'));
    if (ballsFromStorage !== null) {
      setBalls(ballsFromStorage);
    } else if (ballsFromStorage === null) {
      await AsyncStorage.setItem('Balls', JSON.stringify(BALLS));
      setBalls(BALLS);
    }

    const platformsFromStorage = JSON.parse(
      await AsyncStorage.getItem('Platforms'),
    );
    if (platformsFromStorage !== null) {
      setPlatforms(platformsFromStorage);
    } else if (platformsFromStorage === null) {
      await AsyncStorage.setItem('Platforms', JSON.stringify(PLATFORMS));
      setPlatforms(PLATFORMS);
    }

    const points = await AsyncStorage.getItem('Score');
    const backgroundte = await AsyncStorage.getItem('Background');
    setPoints(+points);

    if (backgroundte === null) {
      const currBack =
        'https://img.freepik.com/free-vector/city-landmarks-background-video-conferencing_23-2148617734.jpg?t=st=1708350788~exp=1708351388~hmac=a4a6db3defc3878165602ef47724c15acedcca8378acce7f052063850c03bab9';
      setBackground(currBack);
    } else setBackground(backgroundte);
  };

  useFocusEffect(
    React.useCallback(() => {
      getInit();
    }, []),
  );

  const renderBalls = useCallback(() => {
    if (balls)
      return balls.map(i => (
        <BallsComponent
          price={i.price}
          name={i.name}
          byed={i.byed}
          key={i.name}
          listBalls={balls}
          setBalls={setBalls}
          setPoints={setPoints}
        />
      ));
  }, [balls]);

  const renderBackgrounds = useCallback(() => {
    if (listBackgrounds)
      return listBackgrounds.map(i => (
        <ImageComponent
          setPoints={setPoints}
          points={points}
          key={i.name}
          source={i.source}
          byed={i.byed}
          price={i.price}
          setBackground={setBackground}
          listBackgrounds={listBackgrounds}
          setBackgrounds={setBackgrounds}
        />
      ));
  }, [listBackgrounds]);

  const renderPlatforms = useCallback(() => {
    if (platforms)
      return platforms.map(i => (
        <PlatformsComponent
          name={i.name}
          byed={i.byed}
          price={i.price}
          setPoints={setPoints}
          platforms={platforms}
          setPlatforms={setPlatforms}
          key={i.name}
        />
      ));
  }, [platforms]);

  return (
    <ImageBackground
      style={{flex: 1, backgroundColor: '#fff'}}
      source={{uri: background}}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.15)'}}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 90,
            letterSpacing: 1,
            color: 'rgba(255, 216, 107, 1)',
          }}
        >
          Shop{'\n'}
          {points}$
        </Text>
        <BackArrow onPress={handleBack} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={{width: '100%'}}
        >
          <HeaderText text={'Backgrounds'} />
          {renderBackgrounds()}
          <HeaderText text={'Balls'} />
          {renderBalls()}
          <HeaderText text={'Platforms'} />
          {renderPlatforms()}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const PlatformsComponent = ({
  name,
  byed,
  price,
  setPoints,
  platforms,
  setPlatforms,
}) => {
  const getBallImage = ballName => {
    switch (ballName) {
      case 'platform1':
        return PLATFORMS_RENDER.platform1;
      case 'platform2':
        return PLATFORMS_RENDER.platform2;
      case 'platform3':
        return PLATFORMS_RENDER.platform3;
      case 'platform4':
        return PLATFORMS_RENDER.platform4;
      default:
        return 'DEFAULT_IMAGE';
    }
  };

  const platformImg = getBallImage(name);

  const handlePress = async () => {
    const Score = await AsyncStorage.getItem('Score');
    const canBuy = Number(Score) >= Number(price);

    if (byed) {
      await AsyncStorage.setItem('Platform', JSON.stringify(platformImg));
      Toast.show({
        type: 'success',
        text1: 'Selected !',
      });
    } else {
      if (canBuy) {
        setPoints(prev => prev - price);
        await AsyncStorage.setItem('Score', (Score - price).toString());
        await AsyncStorage.setItem('Platform', JSON.stringify(platformImg));
        const newPlatforms = platforms.map(item => {
          if (item.price === price) {
            return {...item, byed: true};
          }
          return item;
        });
        setPlatforms(newPlatforms);
        await AsyncStorage.setItem('Platforms', JSON.stringify(newPlatforms));
        Toast.show({
          type: 'success',
          text1: 'Selected !',
        });
      } else
        Toast.show({
          type: 'error',
          text1: 'Not enought coins',
        });
    }
  };

  return (
    <View
      style={{
        width: '80%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      {platformImg === 'DEFAULT_IMAGE' ? (
        <View
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              borderRadius: 20,
              width: '99%',
              height: '20%',
              backgroundColor: '#000',
            }}
          />
        </View>
      ) : (
        <Image
          source={platformImg}
          style={{
            width: 100,
            height: 100,
          }}
          resizeMode="contain"
        />
      )}
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: byed ? 'green' : 'rgba(255, 216, 107,1)',
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 20,
          elevation: 1,
        }}
      >
        <Text
          style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 20}}
        >
          {byed ? 'select' : price + '$'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BallsComponent = ({
  name,
  byed,
  price,
  setPoints,
  listBalls,
  setBalls,
}) => {
  const getBallImage = ballName => {
    switch (ballName) {
      case 'ball1':
        return BALLS_RENDER.ball1;
      case 'ball2':
        return BALLS_RENDER.ball2;
      case 'ball3':
        return BALLS_RENDER.ball3;
      case 'ball4':
        return BALLS_RENDER.ball4;
      default:
        return 'DEFAULT_IMAGE';
    }
  };

  const ballImage = getBallImage(name);

  const handlePress = async () => {
    const Score = await AsyncStorage.getItem('Score');
    const canBuy = Number(Score) >= Number(price);

    if (byed) {
      await AsyncStorage.setItem('Ball', JSON.stringify(ballImage));
      Toast.show({
        type: 'success',
        text1: 'Selected !',
      });
    } else {
      if (canBuy) {
        setPoints(prev => prev - price);
        await AsyncStorage.setItem('Score', (Score - price).toString());
        await AsyncStorage.setItem('Ball', JSON.stringify(ballImage));
        const newBalls = listBalls.map(item => {
          if (item.price === price) {
            return {...item, byed: true};
          }
          return item;
        });
        setBalls(newBalls);
        await AsyncStorage.setItem('Balls', JSON.stringify(newBalls));
        Toast.show({
          type: 'success',
          text1: 'Selected !',
        });
      } else
        Toast.show({
          type: 'error',
          text1: 'Not enought coins',
        });
    }
  };

  return (
    <View
      style={{
        width: '80%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      {ballImage === 'DEFAULT_IMAGE' ? (
        <View
          style={{
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              borderRadius: 200,
              width: '99%',
              height: '99%',
              backgroundColor: '#000',
            }}
          />
        </View>
      ) : (
        <Image
          source={ballImage}
          style={{
            width: 100,
            height: 100,
          }}
          resizeMode="contain"
        />
      )}
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: byed ? 'green' : 'rgba(255, 216, 107,1)',
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 20,
          elevation: 1,
        }}
      >
        <Text
          style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 20}}
        >
          {byed ? 'select' : price + '$'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ImageComponent = ({
  source,
  byed,
  price,
  setPoints,
  setBackground,
  listBackgrounds,
  setBackgrounds,
}) => {
  const handlePress = async () => {
    const Score = await AsyncStorage.getItem('Score');
    const canBuy = Number(Score) >= Number(price);
    if (byed) {
      await AsyncStorage.setItem('Background', source);
      setBackground(source);
    } else {
      if (canBuy) {
        setPoints(prev => prev - price);
        await AsyncStorage.setItem('Score', (Score - price).toString());
        await AsyncStorage.setItem('Background', source);
        setBackground(source);
        const newBackgrounds = listBackgrounds.map(item => {
          if (item.price === price) {
            return {...item, byed: true};
          }
          return item;
        });
        setBackgrounds(newBackgrounds);
        await AsyncStorage.setItem(
          'Backgrounds',
          JSON.stringify(newBackgrounds),
        );
      } else
        Toast.show({
          type: 'error',
          text1: 'Not enought coins',
        });
    }
  };
  return (
    <View
      style={{
        width: '80%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      <Image
        source={{uri: source}}
        style={{
          width: 100,
          height: 100,
          borderWidth: 1,
        }}
        resizeMode="cover"
      />

      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: byed ? 'green' : 'rgba(255, 216, 107,1)',
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 20,
          elevation: 1,
        }}
      >
        <Text
          style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 20}}
        >
          {byed ? 'select' : price + '$'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const HeaderText = ({text}) => {
  return (
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: 32,
        letterSpacing: 1,
        color: 'rgba(255, 216, 107,1)',
        width: '100%',
        textAlign: 'left',
        marginBottom: 20,
      }}
    >
      {text}
    </Text>
  );
};
export const BackArrow = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        top: 60,
        right: 30,
        width: 45,
        height: 45,
      }}
    >
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828774.png',
        }}
        resizeMode="contain"
        style={{width: '100%', height: '100%'}}
      />
    </TouchableOpacity>
  );
};
