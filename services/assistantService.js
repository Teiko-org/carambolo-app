import aiApi from "./api/aiApi";
import { Platform } from "react-native";

export const askQuestion = async (
  question,
  sessionId = null,
  confirmation = null
) => {
  const body = {
    question,
    session_id: sessionId,
  };
  if (confirmation) {
    body.confirmation = confirmation;
  }
  const { data } = await aiApi.post("/api/v1/ask", body);
  return data;
};

const extensionForMime = (mimeType) => {
  if (mimeType === "audio/webm") return "webm";
  if (mimeType === "audio/wav" || mimeType === "audio/x-wav") return "wav";
  if (mimeType === "audio/mpeg") return "mp3";
  return "m4a";
};

export const askAudio = async (uri, mimeType, sessionId = null) => {
  const formData = new FormData();
  const ext = extensionForMime(mimeType);

  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("audio", blob, `question.${ext}`);
  } else {
    formData.append("audio", {
      uri,
      name: `question.${ext}`,
      type: mimeType,
    });
  }

  if (sessionId) {
    formData.append("session_id", sessionId);
  }

  const { data } = await aiApi.post("/api/v1/ask/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getInsights = async (context = "dashboard_main") => {
  const { data } = await aiApi.post("/api/v1/insights", { context });
  return data;
};

export const getSuggestedPrompts = async () => {
  const { data } = await aiApi.get("/api/v1/suggested-prompts");
  return data;
};
