export const GOALS = ["lose", "maintain", "gain"] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "🔥 Lose Weight",
  maintain: "⚖ Maintain Weight",
  gain: "💪 Gain Muscle",
};
