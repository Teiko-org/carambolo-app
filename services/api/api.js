import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getExpoHost = () => {

  const hostUri =
    Constants?.expoGoConfig?.debuggerHost ||
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri

  if (!hostUri) return null

  const host = hostUri.split(":")[0]

  if (!host || host.includes("exp.direct")) return null

  return host
};

const getApiBaseUrl = () => {
  // Web dev: always hit local Java — avoids stale LAN IPs in .env / Metro cache.
  if (__DEV__ && Platform.OS === "web") {
    return "http://localhost:8080";
  }

  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:8080`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://localhost:8080";
};

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

export { getApiBaseUrl }
export default api;