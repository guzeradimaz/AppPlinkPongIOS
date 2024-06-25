import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BackArrow} from '../Shop/Shop';
import {RotatedScrn, getLandscape} from '../Home/RotatedScrn';

export const Levels = () => {
  const nav = useNavigation();
  const [currentBackground, setCurrentBackground] = useState(null);
  const getInitData = async () => {
    const backgroundFromStorage = await AsyncStorage.getItem('Background');
    if (backgroundFromStorage === null) {
      const currBack =
        'https://img.freepik.com/free-vector/city-landmarks-background-video-conferencing_23-2148617734.jpg?t=st=1708350788~exp=1708351388~hmac=a4a6db3defc3878165602ef47724c15acedcca8378acce7f052063850c03bab9';
      setCurrentBackground(currBack);
    } else setCurrentBackground(backgroundFromStorage);
  };

  const handleBack = () => nav.goBack();

  useFocusEffect(
    useCallback(() => {
      getInitData();
    }, []),
  );

  const Levels = [
    {
      mode: '1 level',
      id: '1231fdsasdf',
      title: '1 level',
      backgroundColor: 'rgba(0,0,0,0.15)',
      uri:
        'https://media.istockphoto.com/id/1425837765/photo/two-table-tennis-rackets-with-ball-on-blue-background-with-copy-space.jpg?s=612x612&w=0&k=20&c=420Kc_AeQvIsu8Xo4M2XHCVU9H51DECFiFrM8g5ELOQ=',
    },
    {
      mode: '2 level',
      id: '1231fdjvh9sasdf',
      title: '2 level',
      backgroundColor: 'rgba(0,0,0,0.15)',
      uri:
        'https://media.istockphoto.com/id/1425837765/photo/two-table-tennis-rackets-with-ball-on-blue-background-with-copy-space.jpg?s=612x612&w=0&k=20&c=420Kc_AeQvIsu8Xo4M2XHCVU9H51DECFiFrM8g5ELOQ=',
    },
    {
      mode: '3 level',
      id: '1231hhk88766fdjvh9sasdf',
      title: '3 level',
      backgroundColor: 'rgba(0,0,0,0.15)',
      uri:
        'https://media.istockphoto.com/id/1425837765/photo/two-table-tennis-rackets-with-ball-on-blue-background-with-copy-space.jpg?s=612x612&w=0&k=20&c=420Kc_AeQvIsu8Xo4M2XHCVU9H51DECFiFrM8g5ELOQ=',
    },
    {
      mode: '4 level',
      id: '1231hhk81324536u7ssd8766fdjvh9sasdf',
      title: '4 level',
      backgroundColor: 'rgba(0,0,0,0.15)',
      uri:
        'https://media.istockphoto.com/id/1425837765/photo/two-table-tennis-rackets-with-ball-on-blue-background-with-copy-space.jpg?s=612x612&w=0&k=20&c=420Kc_AeQvIsu8Xo4M2XHCVU9H51DECFiFrM8g5ELOQ=',
    },
    {
      mode: '5 level',
      id: '1231hhk8уцпкурепарьп1324536u7ssd8766fdjvh9sasdf',
      title: '5 level',
      backgroundColor: 'rgba(0,0,0,0.15)',
      uri:
        'https://media.istockphoto.com/id/1425837765/photo/two-table-tennis-rackets-with-ball-on-blue-background-with-copy-space.jpg?s=612x612&w=0&k=20&c=420Kc_AeQvIsu8Xo4M2XHCVU9H51DECFiFrM8g5ELOQ=',
    },
    {
      mode: 'infinity',
      id: 'f2ef2gfkkfdj',
      title: 'infinity mode',
      backgroundColor: 'rgba(255,255,255,0.15)',
      uri:
        'https://media.istockphoto.com/id/828605644/video/abstract-background-with-infinity-sign-digital-background.jpg?s=640x640&k=20&c=lw7R50fxGQNHAnHghFFqg2McWPgJAaeT1HhIfP1_Bk8=',
    },
    {
      mode: 'no-obst',
      id: '1231fdsasdfasfasff',
      title: 'no obstacles',
      backgroundColor: 'rgba(0,0,0,0.55)',
      uri:
        'https://authenticrecognition.com/wp-content/uploads/2017/06/Stop_Barrier_Fotolia_126539045_S.jpg',
    },
    {
      mode: 'classic',
      id: '1231fdsfasdasdfasfasff',
      title: 'classic',
      backgroundColor: 'rgba(0,0,0,1)',
      uri:
        'https://authenticrecognition.com/wp-content/uploads/2017/06/Stop_Barrier_Fotolia_126539045_S.jpg',
    },
    {
      mode: 'more-obst',
      id: '1231fdsfavsdsdasdfasfasff',
      title: 'crazy obstacles',
      backgroundColor: 'rgba(0,0,0,0.35)',
      uri: 'https://sngroup.com/wp-content/uploads/2010/08/bar.jpg',
    },
    {
      mode: 'player-vs-comp',
      id: '1231fdsfavsdfassdasdfasfasff',
      title: 'player vs island',
      backgroundColor: 'rgba(255,255,255,0.15)',
      uri:
        'https://www.imcgrupo.com/wp-content/uploads/2022/05/Human-Player-vs-Computer-in-Gaming-01.png',
    },
    {
      mode: 'bonus',
      id: '1231fdsfavsadsdfassdasdfasfasff',
      title: 'more bonuses',
      backgroundColor: 'rgba(0,0,0,0.35)',
      uri: 'https://www.robeycpa.ca/wp-content/uploads/2015/11/Bonus.jpg',
    },
  ];

  const renderItem = item => {
    const handleNavigate = () => {
      nav.navigate('Game', {type: item.mode});
    };
    return (
      <ImageBackground
        source={{uri: item.uri}}
        resizeMode="cover"
        style={{
          width: 300,
          height: 100,
          borderRadius: 10,
          elevation: 5,
          overflow: 'hidden',
          marginTop: 25,
        }}
      >
        <TouchableOpacity
          onPress={handleNavigate}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
            backgroundColor: item.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 24,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'rgba(255, 216, 107,1)',
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  const [rotate, setRotate] = useState(getLandscape());

  useFocusEffect(
    React.useCallback(() => {
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
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 100,
            letterSpacing: 1,
            color: 'rgba(255, 216, 107,1)',
            width: '100%',
            textAlign: 'left',
          }}
        >
          Levels
        </Text>
        <BackArrow onPress={handleBack} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{width: '100%', alignItems: 'center'}}
          style={{width: '100%', marginTop: 50}}
          data={Levels}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
