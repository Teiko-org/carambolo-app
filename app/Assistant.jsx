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
  const [historyReady, setHistoryReady] = useState(false);

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
      setHistoryReady(true);
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
                attachments: data.attachments || [],
                pendingConfirmation: data.pending_confirmation || null,
                feedback: null,
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
              const isTimeout =
                err?.code === "ECONNABORTED" ||
                /timeout/i.test(err?.message || "");
              let errorText =
                "Desculpe, não consegui processar sua pergunta. Tente novamente.";

              if (isTimeout) {
                errorText =
                  "A resposta demorou mais que o esperado. Aguarde um pouco e tente de novo.";
              } else if (status === 429) {
                errorText =
                  "Estou com muitas solicitações no momento. Aguarde alguns segundos e tente novamente.";
              } else if (status === 400 && detail) {
                errorText = detail;
              } else if (
                (status === 422 || status === 500 || status === 502) &&
                typeof detail === "string" &&
                detail.trim()
              ) {
                errorText = detail.trim();
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

  const handleConfirmPending = useCallback(
    (botMessage) => {
      const pending = botMessage?.pendingConfirmation;
      if (!pending || askMutation.isPending) return;

      const userMsg = {
        id: `user-${Date.now()}`,
        text: "Confirmo.",
        isBot: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const cleared = prev.map((m) =>
          m.id === botMessage.id
            ? { ...m, pendingConfirmation: null }
            : m
        );
        const updated = [...cleared, userMsg];
        persistMessages(updated, sessionId);
        return updated;
      });

      askMutation.mutate(
        {
          question: "Confirmo.",
          sessionId,
          confirmation: {
            action: pending.action,
            confirm_token: pending.confirm_token,
            payload: pending.payload || {},
          },
        },
        {
          onSuccess: (data) => {
            const newSid = data.session_id || sessionId;
            if (newSid !== sessionId) setSessionId(newSid);
            const botMsg = {
              id: `bot-${Date.now()}`,
              text: data.answer,
              isBot: true,
              timestamp: Date.now(),
              attachments: data.attachments || [],
              pendingConfirmation: null,
              feedback: null,
            };
            setMessages((p) => {
              const withBot = [...p, botMsg];
              persistMessages(withBot, newSid);
              return withBot;
            });
          },
          onError: (err) => {
            const detail = err?.response?.data?.detail;
            const errorMsg = {
              id: `error-${Date.now()}`,
              text:
                typeof detail === "string" && detail.trim()
                  ? detail.trim()
                  : "Nao foi possivel confirmar a acao. Tente novamente.",
              isBot: true,
              timestamp: Date.now(),
            };
            setMessages((p) => [...p, errorMsg]);
          },
        }
      );
    },
    [askMutation, sessionId, persistMessages]
  );

  const handleMessageFeedback = useCallback(
    (messageId, feedback) => {
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === messageId ? { ...m, feedback: feedback || null } : m
        );
        persistMessages(updated, sessionId);
        return updated;
      });
    },
    [sessionId, persistMessages]
  );

  const handleCancelPending = useCallback((botMessage) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      text: "Cancelado.",
      isBot: false,
      timestamp: Date.now(),
    };
    const botReply = {
      id: `bot-${Date.now()}`,
      text: "Ok, nada foi alterado no sistema.",
      isBot: true,
      timestamp: Date.now(),
    };
    setMessages((prev) => {
      const cleared = prev.map((m) =>
        m.id === botMessage.id ? { ...m, pendingConfirmation: null } : m
      );
      const updated = [...cleared, userMsg, botReply];
      persistMessages(updated, sessionId);
      return updated;
    });
  }, [sessionId, persistMessages]);

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

      <ChatMessages
        messages={messages}
        loading={askMutation.isPending}
        historyReady={historyReady}
        onConfirmPending={handleConfirmPending}
        onCancelPending={handleCancelPending}
        onMessageFeedback={handleMessageFeedback}
      />

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
