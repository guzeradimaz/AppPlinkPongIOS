import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const music = new Sound(require('./game.mp3'), error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // when loaded successfully
  console.log(
    'duration in seconds: ' +
      music.getDuration() +
      'number of channels: ' +
      music.getNumberOfChannels(),
  );
});

export const musicPlayPause = () => {
  music.setNumberOfLoops(-1);
  music.play(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  });
};

export const musicPause = () => {
  music.stop(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  });
};


export const pingPong = new Sound(require('./pingPong.mp3'), error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // when loaded successfully
  console.log(
    'duration in seconds: ' +
      pingPong.getDuration() +
      'number of channels: ' +
      pingPong.getNumberOfChannels(),
  );
});

export const pingPongPlay = () => {
  pingPong.play(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  });
};
