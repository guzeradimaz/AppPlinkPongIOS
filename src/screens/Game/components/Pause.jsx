import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export const Pause = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        top: 60,
        left: 30,
        zIndex: 20,
        width: 50,
        height: 50,
      }}
    >
      <Image
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/2920/2920686.png',
        }}
      />
    </TouchableOpacity>
  );
};
