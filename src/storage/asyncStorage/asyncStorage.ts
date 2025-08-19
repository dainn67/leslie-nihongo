import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToAsyncStorage = async (key: string, config: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(config));
};

export const loadFromAsyncStorage = async (key: string) => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const removeFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const clearAllAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export const logAllAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);

    console.log("=== Tất cả dữ liệu trong AsyncStorage ===");
    stores.forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    console.log("=== Kết thúc log AsyncStorage ===");

    return stores;
  } catch (error) {
    console.error("Lỗi khi log AsyncStorage:", error);
    return [];
  }
};
