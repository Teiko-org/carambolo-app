import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getExpoHost = () => {
  const hostUri =
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

const getEtlApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_ETL_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:8001`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8001";
  }

  return "http://localhost:8001";
};

const etlApi = axios.create({
  baseURL: getEtlApiBaseUrl(),
  timeout: 120000, // 2 minutos — ETL pode demorar
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

if (__DEV__) {
  console.log("[ETL API] baseURL:", etlApi.defaults.baseURL);
}

export { getEtlApiBaseUrl };
export default etlApi;
