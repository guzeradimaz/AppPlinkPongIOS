import messaging from '@react-native-firebase/messaging';

export const messaging_token_get = async () => {
  try {
    const data = await messaging().getToken();
    return data;
  } catch (e) {
    return null;
  }
};
