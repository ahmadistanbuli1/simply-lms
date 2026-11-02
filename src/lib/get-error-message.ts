import axios from "axios";

// The shape of the object coming from the server
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";
const NETWORK_ERROR_MESSAGE =
  "Network error. Please check your internet connection.";
const INVALID_DATA_MESSAGE = "Invalid request data.";

export const getErrorMessage = async (error: unknown): Promise<string> => {
  // 1. Guard Clause: If the error is not from Axios
  if (!axios.isAxiosError(error)) return DEFAULT_ERROR_MESSAGE;

  // 2. Guard Clause: If the request is sent and the server does not respond at all (internet outage or server down)
  if (!error.response) return NETWORK_ERROR_MESSAGE;

  const data = error.response.data as ApiErrorResponse | string | undefined;

  // 3. Direct processing
  if (!data) return INVALID_DATA_MESSAGE;

  if (typeof data === "string") return data;

  return data.error || data.message || INVALID_DATA_MESSAGE;
};
