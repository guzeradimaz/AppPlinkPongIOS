import React from 'react';
import {Dimensions, Text, View} from 'react-native';

export const RotatedScrn = () => {
  return (
    <View
      style={{
        backgroundColor: 'rgb(17,17,17)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          width: '80%',
        }}
      >
        This app works only in portrait mode, rotate phone back to portrait mode
      </Text>
    </View>
  );
};

export function getLandscape() {
  return typeof Dimensions.get('window') !== 'undefined' &&
    Dimensions.get('window').width > Dimensions.get('window').height
    ? 'landscape'
    : 'portrait';
}
