import { useQuery, useMutation } from "@tanstack/react-query";
import {
  askQuestion,
  getInsights,
  getSuggestedPrompts,
} from "../services/assistantService";

const shouldRetry = (failureCount, error) => {
  const status = error?.response?.status;
  if (status === 429 || status === 422) return false;
  return failureCount < 2;
};

export const useInsights = (enabled = false) => {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["assistant-insights"],
    queryFn: () => getInsights("dashboard_main"),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    enabled,
  });
  return { data, isLoading, error, isError, refetch };
};

export const useSuggestedPrompts = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["suggested-prompts"],
    queryFn: getSuggestedPrompts,
    staleTime: 10 * 60 * 1000,
    retry: shouldRetry,
  });
  return { data, isLoading, error, isError };
};

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: ({ question, sessionId }) => askQuestion(question, sessionId),
    retry: false,
  });
};
