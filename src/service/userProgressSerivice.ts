import { createUserProgress, UserProgress } from "../models/userProgress";
import { loadConfig, saveConfig } from "../storage/asyncStorage/asyncStorage";
import { AsyncStorageConstants } from "../storage/asyncStorage/asyncStorateConstant";

export const getUserProgressFromStorage = async (): Promise<UserProgress> => {
  const userProgress = await loadConfig(AsyncStorageConstants.USER_PROGRESS);
  return createUserProgress(userProgress);
};

export const setUserProgressToStorage = async (userProgress: any) => {
  await saveConfig(AsyncStorageConstants.USER_PROGRESS, userProgress);
};
