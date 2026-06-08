import axios from "axios";
import { resolveDevBaseUrl } from "./resolveDevBaseUrl";

const getAiApiBaseUrl = () =>
  resolveDevBaseUrl(process.env.EXPO_PUBLIC_AI_API_URL, 8000);

const AI_REQUEST_TIMEOUT_MS = 120000;

const aiApi = axios.create({
  baseURL: getAiApiBaseUrl(),
  timeout: AI_REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

if (__DEV__) {
  console.log("[AI API] baseURL:", aiApi.defaults.baseURL);
}

export { getAiApiBaseUrl };
export default aiApi;
