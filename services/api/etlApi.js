import axios from "axios";
import { resolveDevBaseUrl } from "./resolveDevBaseUrl";

const getEtlApiBaseUrl = () =>
  resolveDevBaseUrl(process.env.EXPO_PUBLIC_ETL_API_URL, 8001);

const etlApi = axios.create({
  baseURL: getEtlApiBaseUrl(),
  timeout: 120000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

if (__DEV__) {
  console.log("[ETL API] baseURL:", etlApi.defaults.baseURL);
}

export { getEtlApiBaseUrl };
export default etlApi;
