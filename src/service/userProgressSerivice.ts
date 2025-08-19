import { createUserProgress, UserProgress } from "../models/userProgress";
import { loadFromAsyncStorage, saveToAsyncStorage } from "../storage/asyncStorage/asyncStorage";
import { AsyncStorageConstants } from "../storage/asyncStorage/asyncStorateConstant";
import { convertDateToDDMMYYYY } from "../utils";

export class UserProgressService {
  static getUserProgressFromStorage = async (): Promise<UserProgress> => {
    const userProgress = await loadFromAsyncStorage(AsyncStorageConstants.USER_PROGRESS);
    return createUserProgress(userProgress);
  };

  static setUserProgressToStorage = async (userProgress: any) => {
    await saveToAsyncStorage(AsyncStorageConstants.USER_PROGRESS, userProgress);
  };

  static createUserProgressString = (analytic: { [key: string]: string }) => {
    let progress = "";
    Object.entries(analytic).forEach(([key, value]) => {
      progress += `${convertDateToDDMMYYYY(key)}: ${value}\n`;
    });
    progress = progress.trim();
    return progress;
  };
}
