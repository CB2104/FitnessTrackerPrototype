export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

type BMICategory = "underweight" | "normal" | "overweight" | "obese";

export const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

export const getBMIColor = (category: BMICategory): string => {
  const colors: Record<BMICategory, string> = {
    underweight: "text-blue-500",
    normal: "text-emerald-500",
    overweight: "text-orange-500",
    obese: "text-red-500",
  };
  return colors[category];
};