import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ActivityEntry, Credentials, FoodEntry, User } from "../types";
import api from "../configs/api";
import { isOnboardingComplete } from "../utils/user";
import { handleError } from "../utils/errors";
import { AppContext } from "./AppContext";
import {
  getStoredToken,
  hasStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../utils/auth";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [isUserFetched, setIsUserFetched] = useState(!hasStoredToken());
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setOnboardingCompleted(false);
      setAllFoodLogs([]);
      setAllActivityLogs([]);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const addFoodLog = (entry: FoodEntry) => {
    setAllFoodLogs((prev) => [...prev, entry]);
  };

  const removeFoodLog = (documentId: string) => {
    setAllFoodLogs((prev) => prev.filter((e) => e.documentId !== documentId));
  };

  const addActivityLog = (entry: ActivityEntry) => {
    setAllActivityLogs((prev) => [...prev, entry]);
  };

  const removeActivityLog = (documentId: string) => {
    setAllActivityLogs((prev) =>
      prev.filter((e) => e.documentId !== documentId),
    );
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  const signup = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local/register", credentials);

      setUser({ ...data.user, token: data.jwt });
      setOnboardingCompleted(isOnboardingComplete(data.user));
      setStoredToken(data.jwt);
    } catch (error) {
      handleError(error);
    }
  };

  const login = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local", {
        identifier: credentials.email,
        password: credentials.password,
      });

      setUser({ ...data.user, token: data.jwt });
      setOnboardingCompleted(isOnboardingComplete(data.user));
      setStoredToken(data.jwt);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get("/api/users/me");

      setUser({ ...data, token });
      setOnboardingCompleted(isOnboardingComplete(data));
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsUserFetched(true);
    }
  };

  const fetchFoodLogs = async () => {
    try {
      const { data } = await api.get("/api/food-logs");
      setAllFoodLogs(data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data } = await api.get("/api/activity-logs");
      setAllActivityLogs(data);
    } catch (error) {
      handleError(error);
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setOnboardingCompleted(false);
    navigate("/");
  };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsUserFetched(true);
      return;
    }
    (async () => {
      try {
        await fetchUser(token);
        await Promise.all([fetchFoodLogs(), fetchActivityLogs()]);
      } catch {
        // fetchUser
      }
    })();
  }, []);

  const value = {
    user,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted,
    completeOnboarding,
    allFoodLogs,
    addFoodLog,
    removeFoodLog,
    allActivityLogs,
    addActivityLog,
    removeActivityLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
