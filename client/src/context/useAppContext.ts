import { useContext } from "react";
import type { AppContextType } from "../types";
import { AppContext } from "./AppContext";

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
