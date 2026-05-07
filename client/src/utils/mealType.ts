const BREAKFAST_END_HOUR = 12;
const LUNCH_END_HOUR = 16;
const SNACK_END_HOUR = 18;

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const inferMealTypeFromHour = (hour: number): MealType => {
  if (hour < BREAKFAST_END_HOUR) return "breakfast";
  if (hour < LUNCH_END_HOUR) return "lunch";
  if (hour < SNACK_END_HOUR) return "snack";
  return "dinner";
};
