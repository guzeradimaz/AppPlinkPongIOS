import React from 'react';
import {Text, View} from 'react-native';

export const ScoreMainScreen = ({score, currentBackground}) => {
  return (
    <View
      style={{
        width: '100%',
        zIndex: 0,
        position: 'absolute',
        top: 100,
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 80,
          letterSpacing: 1,
          color: 'rgba(255, 216, 107,1)',
        }}
      >
        Secret pyramid Pong
      </Text>
      {score && (
        <>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 120,
              letterSpacing: 1,
              color: 'rgba(255, 216, 107,1)',
            }}
          >
            {score}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginLeft: 10,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'rgba(255, 216, 107,1)',
            }}
          >
            points
          </Text>
        </>
      )}
    </View>
  );
};
