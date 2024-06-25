import appsFlyer from "react-native-appsflyer";

export const hash_get = async () => {
  try {
    return new Promise((resolve, reject) => {
      appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(appsFlyerUID);
        }
      });
    });
  } catch (e) {
    return null;
  }
};