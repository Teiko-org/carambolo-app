import axios from "axios";
import { resolveDevBaseUrl } from "./resolveDevBaseUrl";

const getApiBaseUrl = () =>
  resolveDevBaseUrl(process.env.EXPO_PUBLIC_API_URL, 8080);

const API_REQUEST_TIMEOUT_MS = 30000;

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

if (__DEV__) {
  console.log("[API] baseURL:", api.defaults.baseURL);
}

export { getApiBaseUrl };
export default api;
