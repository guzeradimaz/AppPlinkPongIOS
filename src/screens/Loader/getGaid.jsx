import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';

export const gaid_get = async () => {
  try {
    const data = await ReactNativeIdfaAaid.getAdvertisingInfo();
    return data.id;
  } catch (e) {
    return null;
  }
};
