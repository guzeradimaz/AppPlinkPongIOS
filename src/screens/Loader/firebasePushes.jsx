import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    GetFCMToken();
  }
};

async function GetFCMToken() {
  let token = await AsyncStorage.getItem('token');
  if (!token) {
    try {
      let token = await messaging().getToken();
      if (token) {
        AsyncStorage.setItem('token', token);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(remoteMessage.notification);
  });
  messaging().setBackgroundMessageHandler(remoteMessage => {
    console.log(remoteMessage.notification);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      const url = remoteMessage?.data?.postback_click_url;
      if (url) {
        getPostbackQuery(url);
      }
      if (remoteMessage) {
        console.log(remoteMessage.notification);
      }
    });
};

async function getPostbackQuery(url) {
  const data = await fetch(url);
}
