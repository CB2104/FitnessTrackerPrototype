import axios from "axios";
import toast from "react-hot-toast";

/**
 Para calibrar errores entendibles en humano
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error?.message ??
      error.message ??
      "Network error"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
};

/**
 Errores por default
 */
export const handleError = (error: unknown): void => {
  console.error(error);
  toast.error(getErrorMessage(error));
};