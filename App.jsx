import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from './src/screens/Home';
import {Game} from './src/screens/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Shop} from './src/screens/Shop/Shop';
import Toast from 'react-native-toast-message';
import {Bonus} from './src/screens/Bonus/Bonus';
import {Levels} from './src/screens/Levels/Levels';
import {Loader} from './src/screens/Loader/Loader';
import { Web } from './src/screens/WebView/WebView';

import { getTrackingStatus } from 'react-native-tracking-transparency';

const Stack = createNativeStackNavigator();

const options = {
  headerShown: false,
};

export const APPSFLYER_DEV_KEY = 'KPs5Uv6fPaD2zFuKYjdLQD';
export const ONESIGNAL_DEV_KEY = '7d0c6284-2b84-4665-95b0-165193c8876d';
export const FACEBOOK_APP_ID = '1919430605126628';

export const appsFlyerDocs = {
  devKey: APPSFLYER_DEV_KEY,
  onInstallConversionDataListener: true,
  onDeepLinkListener: true,
  appId: '6476144894',
};

export const App = () => {
  const [score, setScore] = useState(null);

  const getData = async () => {
    const trackingStatus = await getTrackingStatus();
    const data = await AsyncStorage.getItem('Score');
    setScore(+data);
    return +data;
  };

  useEffect(() => {
    
    getData();
  }, []);
  
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={options} name="Loader" component={Loader} />
          <Stack.Screen options={options} name="Web" component={Web} />
          <Stack.Screen
            options={options}
            name="Home"
            component={Home}
            initialParams={{newScore: score}}
          />
          <Stack.Screen options={options} name="Game" component={Game} />
          <Stack.Screen options={options} name="Shop" component={Shop} />
          <Stack.Screen options={options} name="Levels" component={Levels} />
          <Stack.Screen options={options} name="Bonus" component={Bonus} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};
