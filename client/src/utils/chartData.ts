import type { ActivityEntry, FoodEntry } from "../types";
import { filterByDate } from "./date";

export type DailyCalorieData = {
  name: string;
  Intake: number;
  Burn: number;
  date: string;
};

const DAYS_IN_WEEK = 7;

const getDateOffsetFromToday = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const sumCalories = <T extends { calories?: number }>(items: T[]): number =>
  items.reduce((total, item) => total + (item.calories ?? 0), 0);

export const buildWeeklyChartData = (
  foodLogs: FoodEntry[],
  activityLogs: ActivityEntry[],
): DailyCalorieData[] => {
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {   
    const daysAgo = DAYS_IN_WEEK - 1 - index;
    const date = getDateOffsetFromToday(daysAgo);
    const dateString = date.toISOString().split("T")[0];

    const foodForDay = filterByDate(foodLogs, dateString)
    const activityForDay = filterByDate(activityLogs, dateString)

    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      Intake: sumCalories(foodForDay),
      Burn: sumCalories(activityForDay),
      date: dateString,
    };
  });
};
