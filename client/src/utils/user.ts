import type { User } from "../types";

export const isOnboardingComplete = (user: User): boolean => {
  if (!user) return false;
  return Boolean(user.age && user.weight && user.goal);
};
