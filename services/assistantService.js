import aiApi from "./api/aiApi";

export const askQuestion = async (question, sessionId = null) => {
  const { data } = await aiApi.post("/api/v1/ask", {
    question,
    session_id: sessionId,
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
