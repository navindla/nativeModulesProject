import { NativeModules } from 'react-native';

const { NetworkInfo } = NativeModules;

export const getNetworkInfo = () => {
    return NetworkInfo.getNetworkInfo();
};

export const measureNetworkSpeed = (url) => {
    return NetworkInfo.measureNetworkSpeed(url);
};
