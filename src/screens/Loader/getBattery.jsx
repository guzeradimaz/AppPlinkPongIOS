import DeviceInfo from "react-native-device-info";

export const battery_get = async () => {
  try {
    const data = await DeviceInfo.isBatteryCharging();
    return data;
  } catch (e) {
    return null;
  }
};
