import { useState, useCallback, useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import AssistantHeader from "../components/molecules/AssistantHeader/AssistantHeader";
import InsightsPanel from "../components/organisms/InsightsPanel/InsightsPanel";
import ChatMessages from "../components/organisms/ChatMessages/ChatMessages";
import PromptBar from "../components/organisms/PromptBar/PromptBar";
import ChatInput from "../components/molecules/ChatInput/ChatInput";
import {
  useInsights,
  useSuggestedPrompts,
  useAskQuestion,
} from "../hooks/useAssistant";
import { useChatStorage } from "../hooks/useChatStorage";

const WELCOME_MESSAGE = {
  id: "welcome",
  text: "Olá! Sou a Kuroko, assistente inteligente da Carambolos. 🍰\n\nPosso analisar os dados do seu negócio, identificar tendências e sugerir ações para ajudar nas suas decisões. Como posso ajudar hoje?",
  isBot: true,
  timestamp: Date.now(),
};

export default function Assistant() {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const storageReady = useRef(false);

  const { loadChat, saveChat } = useChatStorage();

  const [insightsRequested, setInsightsRequested] = useState(false);

  const {
    data: insightsData,
    isLoading: insightsLoading,
    isError: insightsError,
    refetch: refetchInsights,
  } = useInsights(insightsRequested);
  const { data: promptsData } = useSuggestedPrompts();
  const askMutation = useAskQuestion();

  useEffect(() => {
    (async () => {
      const stored = await loadChat();
      if (stored) {
        setSessionId(stored.sessionId);
        setMessages([WELCOME_MESSAGE, ...stored.messages]);
      }
      storageReady.current = true;
    })();
  }, [loadChat]);

  const persistMessages = useCallback(
    (newMessages, newSessionId) => {
      if (!storageReady.current) return;
      const toSave = newMessages.filter((m) => m.id !== "welcome");
      saveChat(newSessionId, toSave);
    },
    [saveChat]
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || askMutation.isPending) return;

      const userMsg = {
        id: `user-${Date.now()}`,
        text: trimmed,
        isBot: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const updated = [...prev, userMsg];

        askMutation.mutate(
          { question: trimmed, sessionId },
          {
            onSuccess: (data) => {
              const newSid = data.session_id || sessionId;
              if (newSid !== sessionId) setSessionId(newSid);

              const botMsg = {
                id: `bot-${Date.now()}`,
                text: data.answer,
                isBot: true,
                timestamp: Date.now(),
              };

              setMessages((p) => {
                const withBot = [...p, botMsg];
                persistMessages(withBot, newSid);
                return withBot;
              });
            },
            onError: (err) => {
              const status = err?.response?.status;
              const detail = err?.response?.data?.detail;
              let errorText =
                "Desculpe, não consegui processar sua pergunta. Tente novamente.";

              if (status === 429) {
                errorText =
                  "Estou com muitas solicitações no momento. Aguarde alguns segundos e tente novamente.";
              } else if (status === 400 && detail) {
                errorText = detail;
              }

              const errorMsg = {
                id: `error-${Date.now()}`,
                text: errorText,
                isBot: true,
                timestamp: Date.now(),
              };
              setMessages((p) => [...p, errorMsg]);
            },
          }
        );

        persistMessages(updated, sessionId);
        return updated;
      });

      setInputText("");
    },
    [askMutation, sessionId, persistMessages]
  );

  const handlePillSelect = useCallback(
    (prompt) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const handleSend = useCallback(() => {
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  return (
    <KeyboardAvoidingView
      style={screenStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <AssistantHeader
        onBack={() => {
          if (navigation.canGoBack()) {
            router.back();
          } else {
            router.replace("/Dashboard");
          }
        }}
      />

      <InsightsPanel
        insights={insightsData?.insights}
        isLoading={insightsLoading}
        isError={insightsError}
        onRetry={refetchInsights}
        onExpand={() => setInsightsRequested(true)}
      />

      <ChatMessages messages={messages} loading={askMutation.isPending} />

      <PromptBar
        prompts={promptsData?.prompts}
        onSelect={handlePillSelect}
      />

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        loading={askMutation.isPending}
      />
    </KeyboardAvoidingView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEEE7",
  },
});
