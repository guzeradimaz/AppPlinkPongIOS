import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const enterJSToWebView = ` 
      let links = document.getElementsByTagName('a'); 
      for(let i=0;i<links.length; i++){ 
        document.getElementsByTagName('a')[i].target = ""; 
      } 
  `;

export const Web = ({route}) => {
  //states
  const ref = useRef(null);
  const {link} = route.params;
  const navigation = useNavigation();
  const [render, setRender] = useState('');
  const [ua, setUa] = useState('');
  const [mainLink, setMainLink] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
  let timeoutId;

  if (isLoader) {
    timeoutId = setTimeout(() => {
      setIsLoader(false);
    }, 2000);
  }

  return () => {
    clearTimeout(timeoutId);
  };
}, [isLoader]);
  //BACKHANDLER
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (ref.current) ref.current.goBack();
    return true;
  });

  console.warn = function (e) {
    if (e.indexOf(`Can't open url:`) !== -1) {
      Linking.openURL(e.replace(`Can't open url: `, ''));
    }
  };

  const getDataInit = async () => {
    const valData = await AsyncStorage.getItem('link');
    const uaData = await DeviceInfo.getUserAgent();
    const regex = /Version\/[^ ]+\s/g;
    const uaRender = uaData.replace(regex, '');
    setUa(uaRender);
    setRender(valData);
  };

  const onNavigationStateChange = navState => {
    AsyncStorage.setItem('link', navState.url);
  };

  useEffect(() => {
    getDataInit();
  }, []);

  useEffect(() => {
    const temporary =
      render !== null && render !== 'about:blank' ? render : link;
    setMainLink(temporary);
  }, [render, link, ua]);

  if (
    mainLink === 'game' ||
    mainLink === 'http://game/' ||
    mainLink === 'https://game/'
  ) {
    navigation.navigate('Home', {score: 0});
  } else
    return (
      <View style={{flex: 12, backgroundColor:'#000'}}>
        <SafeAreaView style={{flex: 11}}>
          <WebView
            source={{uri: mainLink}}
            onNavigationStateChange={state => {
              setIsLoader(state.loading)
              if (state.title === 'Webpage not available' && !state.loading) {
                if (ref.current) ref.current.goBack();
              }
              onNavigationStateChange(state);
            }}
            onLoadStart={() => setIsLoader(true)}
            onLoadEnd={() => setIsLoader(false)}
            userAgent={ua}
            ref={ref}
            useWebView2={true}
            injectedJavaScript={enterJSToWebView}
            thirdPartyCookiesEnabled={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccessFromFileURLs={true}
          />
        </SafeAreaView>

        <View
          style={{
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              height: 60,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (ref.current) {
                    ref.current.goBack();
                  }
                }}
              >
                <Text style={{color: 'white', fontSize: 20}}>&#60;</Text>
              </TouchableOpacity>
              <View style={{width: 80, height: 50}}>
                {isLoader ? <ActivityIndicator color={'#fff'} size={'large'} /> : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (ref.current) {
                    ref.current.goForward();
                  }
                }}
              >
                <Text style={{color: 'white', fontSize: 20}}>&#62;</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
};
