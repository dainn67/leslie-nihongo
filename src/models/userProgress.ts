export type UserProgress = {
  id: string;
  level: string;
  target: string;
  startDate: number;
  examDate?: number;
  lastUpdated: number;
  analytic: { [key: string]: string };
};

export const createUserProgress = (partial?: Partial<UserProgress>): UserProgress => {
  const now = Date.now();
  return {
    id: partial?.id ?? `user_progress_${Date.now()}`,
    level: partial?.level ?? "",
    target: partial?.target ?? "",
    startDate: partial?.startDate ?? now,
    examDate: partial?.examDate,
    analytic: partial?.analytic ?? {},
    lastUpdated: partial?.lastUpdated ?? now,
  };
};

export const createTmpUserProgress = (userProgress: UserProgress, updates: Partial<UserProgress>): UserProgress => {
  return {
    ...userProgress,
    ...updates,
  };
};
