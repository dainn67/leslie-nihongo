import { storage } from "../storage/mmkv/mmkv";
import { MmkvConstants } from "../storage/mmkv/mmkvConstants";

export const getUserProgress = () => {
  const userProgress = storage.getString(MmkvConstants.USER_PROGRESS);
  return userProgress ? JSON.parse(userProgress) : null;
};

export const setUserProgress = (userProgress: any) => {
  storage.set(MmkvConstants.USER_PROGRESS, JSON.stringify(userProgress));
};
