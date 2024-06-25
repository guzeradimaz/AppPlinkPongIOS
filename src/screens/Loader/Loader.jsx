import React, {useCallback, useEffect, useState} from 'react';
import {ImageBackground, LogBox, Text, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FACEBOOK_APP_ID, ONESIGNAL_DEV_KEY, appsFlyerDocs} from '../../../App';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import remoteConfig from '@react-native-firebase/remote-config';
import appsFlyer from 'react-native-appsflyer';
import {battery_get} from './getBattery';
import {messaging_token_get} from './getToken';
import {gaid_get} from './getGaid';
import {user_agent_get} from './getUserAgent';
import {hash_get} from './getHash';
import Logo from './loader.gif';
import {AppLink, Settings} from 'react-native-fbsdk-next';
import {NotificationListener, requestUserPermission} from './firebasePushes';

LogBox.ignoreAllLogs();

let FETCHED = false;
export const Loader = () => {
  let link = null;

  const [isGame, setIsGame] = useState('');
  const [flyerData, setFlyerData] = useState(null);
  const [appFlyerInitiated, setAppFlyerInitiated] = useState(false);

  const nav = useNavigation();

  const navToGame = async () => {
    await AsyncStorage.setItem('link', 'game');
    setIsGame('game');
    nav.navigate('Home', {score: 0});
  };

  const navToWebScreen = url => {
    AsyncStorage.setItem('link', url);
    nav.navigate('Web', {link: url});
  };

  const startAppFlyerFunctionality = URL => {
    console.log('==================startAppFlyerFunctionality==================');
    console.log(flyerData);
    console.log('====================================');
    const dataToSendAppsFlyer = flyerData;
    battery_get().then(batteryData => {
      messaging_token_get().then(messagingToken => {
        gaid_get().then(gaidData => {
          user_agent_get().then(UserAgent => {
            hash_get().then(HashData => {
              const JsonToSend = {
                hash: HashData,
                app: 'com.PliiInk.PPjNng',
                fcm_push_token: messagingToken,
                data: dataToSendAppsFlyer,
                deeplink: link,
                gaid: gaidData,
                device_info: {
                  charging: batteryData,
                },
              };

              const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  accept: 'application/json',
                  'User-Agent': UserAgent,
                },
                body: JSON.stringify(JsonToSend),
              };
              req(URL, options);
            });
          });
        });
      });
    });
  };

  const checkRemoteConfigFirebase = () => {
    remoteConfig()
      .setDefaults({
        Pong: 'disabled',
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(() => {
        const object = remoteConfig().getValue('Pong').asString();
        const ParsedObj = JSON.parse(object);
        if (ParsedObj.AppsFlyerEnable && ParsedObj.host !== '')
          startAppFlyerFunctionality(ParsedObj.host);
        else navToGame();
      })
      .catch(e => {
        navToGame();
      });
  };

  const checkSavedProp = async () => {
    await AsyncStorage.getItem('link').then(value => {
      if (value !== null) {
        console.log('================value====================');
        console.log(value);
        console.log('====================================');
        value === 'game' ? navToGame() : navToWebScreen(value);
      } else {
    checkRemoteConfigFirebase();
    }
    });
  };

  const req = async (URL, options) => {
    if (FETCHED) {
      return null;
    }
    try {
      const res = await fetch(URL, options);
      const res_req = await res.json();
      if (res_req.success) {
        navToWebScreen(res_req.url);
        FETCHED = true;
      } else {
        navToGame();
        FETCHED = true;
      }
    } catch (e) {
      console.log('ERROR REQUEST  ', e);
      navToGame();
    }
  };

  const setUpSDKs = () => {

    let isOk = false;
    try {
      appsFlyer.initSdk(appsFlyerDocs, null, null);
      requestUserPermission();
      NotificationListener();
      OneSignal.initialize(ONESIGNAL_DEV_KEY);
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      OneSignal.Notifications.requestPermission(true);
      Settings.setAppID(FACEBOOK_APP_ID);
      Settings.initializeSDK();
      Settings.setAdvertiserTrackingEnabled(true);
      AppLink.fetchDeferredAppLink().then(data => {
        link = data;
      });
      isOk = true;
      return isOk;
    } catch (error) {
      console.log('====================================');
      console.log('error init sdk');
      console.log('====================================');
      return isOk;
    }
  };

  // AsyncStorage.clear()
  useFocusEffect(
    useCallback(() => {
      const flyerListener = appsFlyer.onInstallConversionData(data => {
        console.log('========data===data===datadata===data===================');
        console.log(data);
        console.log('====================================');
        setFlyerData(data.data)}
      );

      const isInitedSdk = setUpSDKs();
      if (isInitedSdk) {
        checkSavedProp();
      } else navToGame();
    }, []),
  );

   useEffect(() => {
    if (flyerData && !appFlyerInitiated) {
      checkSavedProp();
      setAppFlyerInitiated(true);
    }
  }, [flyerData, appFlyerInitiated]);


  return <LoaderScreen isGame={isGame} handlePress={navToGame} />;
};

const LoaderScreen = ({isGame, handlePress}) => {
  return (
    <ImageBackground
      source={Logo}
      style={{
        backgroundColor: 'rgb(0,0,0)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {isGame === 'game' ? (
        <TouchableOpacity
          onPress={handlePress}
          style={{
            borderWidth: 1,
            borderColor: '#fff',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
            Play
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            fontWeight: '600',
            color: '#fff',
            fontSize: 24,
            alignItems: 'center',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 50,
          }}
        >
          Loading...{'\n'}Please wait
        </Text>
      )}
    </ImageBackground>
  );
};
