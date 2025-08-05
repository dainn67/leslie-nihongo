import { createUserProgress, UserProgress } from "../models/userProgress";
import { loadFromAsyncStorage, saveToAsyncStorage } from "../storage/asyncStorage/asyncStorage";
import { AsyncStorageConstants } from "../storage/asyncStorage/asyncStorateConstant";

export const getUserProgressFromStorage = async (): Promise<UserProgress> => {
  const userProgress = await loadFromAsyncStorage(AsyncStorageConstants.USER_PROGRESS);
  return createUserProgress(userProgress);
};

export const setUserProgressToStorage = async (userProgress: any) => {
  await saveToAsyncStorage(AsyncStorageConstants.USER_PROGRESS, userProgress);
};
