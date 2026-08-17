import axios from "axios";

export function toApiError(error: unknown): { message: string } {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.error;
    if (typeof serverMessage === "string") return { message: serverMessage };
    if (!error.response) return { message: "Network error. Please check your connection." };
    return { message: error.message || "An unexpected error occurred" };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "An unexpected error occurred" };
}
