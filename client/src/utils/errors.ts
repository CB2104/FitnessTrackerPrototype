import axios from "axios";
import toast from "react-hot-toast";

/**
 * Extracts a human-readable error message from any error shape.
 * Handles axios errors, native Error instances, and unknown values.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error?.message ?? error.message ?? "Network error"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
};

/**
 * Default error handler: logs the error and shows a toast notification.
 */
export const handleError = (error: unknown): void => {
  console.error(error);
  toast.error(getErrorMessage(error));
};
