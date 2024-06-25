import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

export const Button = ({text, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#000',
        borderRadius: 10,
        paddingVertical: 17,
        paddingHorizontal: 25,
        elevation: 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: 'rgb(255, 216, 107)',
          fontSize: 32,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontWeight: 'bold',
          textAlign: 'right',
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
