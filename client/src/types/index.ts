// User
export type User = {
  id: string;
  email: string;
  username: string;
  token: string;
  documentId?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: "lose" | "maintain" | "gain";
  dailyCalorieIntake?: number;
  dailyCalorieBurn?: number;
  createdAt?: string;
} | null;

// Credentials
export type Credentials = {
  username?: string;
  email: string;
  password: string;
};

// User Form Data
export interface UserData {
  name: string;
  age: number;
  weight: number;
  height: number | null;
  goal: "lose" | "maintain" | "gain";
  dailyCalorieIntake?: number;
  dailyCalorieBurn?: number;
  createdAt: string;
}

// Profile Form Data
export interface ProfileFormData {
  age: number;
  weight: number;
  height: number | null;
  goal: string;
  dailyCalorieIntake: number;
  dailyCalorieBurn: number;
}

// Food
export interface FormData {
  name: string;
  calories: number;
  mealType: string;
}

// Food Entry
export interface FoodEntry {
  id: number | string;
  name: string;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  createdAt?: string;
  documentId?: string;
}

// Activity Entry
export interface ActivityEntry {
  id: number;
  name: string;
  duration: number;
  calories: number;
  date: string;
  documentId: string;
  createdAt?: string;
}

export type AppContextType = {
  user: User;
  isUserFetched: boolean;
  fetchUser: (token: string) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  allFoodLogs: FoodEntry[];
  addFoodLog: (entry: FoodEntry) => void;
  removeFoodLog: (documentId: string) => void;
  allActivityLogs: ActivityEntry[];
  addActivityLog: (entry: ActivityEntry) => void;
  removeActivityLog: (documentId: string) => void;
  
};
