import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@kuroko_chat";

export const useChatStorage = () => {
  const loadChat = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.sessionId && Array.isArray(parsed?.messages)) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const saveChat = useCallback(async (sessionId, messages) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionId, messages })
      );
    } catch {
      /* storage write failed silently */
    }
  }, []);

  const clearChat = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage clear failed silently */
    }
  }, []);

  return { loadChat, saveChat, clearChat };
};

