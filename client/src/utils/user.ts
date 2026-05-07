import type { ProfileFormData, User } from "../types";
import {
  DEFAULT_DAILY_CALORIE_BURN,
  DEFAULT_DAILY_CALORIE_INTAKE,
} from "./defaults";

export const isOnboardingComplete = (user: User): boolean => {
  if (!user) return false;
  return Boolean(user.age && user.weight && user.goal);
};

export const buildFormDataFromUser = (user: User): ProfileFormData => ({
  age: user?.age || 0,
  weight: user?.weight || 0,
  height: user?.height || null,
  goal: user?.goal || "maintain",
  dailyCalorieIntake: user?.dailyCalorieIntake || DEFAULT_DAILY_CALORIE_INTAKE,
  dailyCalorieBurn: user?.dailyCalorieBurn || DEFAULT_DAILY_CALORIE_BURN,
});
