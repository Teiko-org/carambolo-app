import { Platform } from "react-native";
import Constants from "expo-constants";

export const getExpoHost = () => {
  const hostUri =
    Constants?.expoGoConfig?.debuggerHost ||
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(":")[0];

  if (!host || host.includes("exp.direct")) {
    return null;
  }

  return host;
};

/** No celular, localhost = o aparelho. Troca pelo IP do Metro/Expo em dev. */
export const resolveDevBaseUrl = (url, fallbackPort) => {
  if (__DEV__ && Platform.OS === "web") {
    return `http://localhost:${fallbackPort}`;
  }

  const trimmed = url?.trim();
  if (trimmed) {
    const expoHost = getExpoHost();
    if (__DEV__ && Platform.OS !== "web" && expoHost && /localhost|127\.0\.0\.1/i.test(trimmed)) {
      return trimmed.replace(/localhost|127\.0\.0\.1/gi, expoHost);
    }
    return trimmed;
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:${fallbackPort}`;
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${fallbackPort}`;
  }

  return `http://localhost:${fallbackPort}`;
};
