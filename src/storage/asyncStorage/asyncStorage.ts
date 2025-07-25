import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveConfig = async (key: string, config: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(config));
};

export const loadConfig = async (key: string) => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const removeConfig = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const clearAllConfig = async () => {
  await AsyncStorage.clear();
};
