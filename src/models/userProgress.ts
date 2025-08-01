export type UserProgress = {
  id: string;
  level: string;
  target: string;
  startDate: number;
  examDate?: number;
  lastUpdated: number;
};

export const createUserProgress = (partial?: Partial<UserProgress>): UserProgress => {
  const now = Date.now();
  return {
    id: partial?.id ?? `user_progress_${Date.now()}`,
    level: partial?.level ?? "",
    target: partial?.target ?? "",
    startDate: partial?.startDate ?? now,
    examDate: partial?.examDate,
    lastUpdated: partial?.lastUpdated ?? now,
  };
};
