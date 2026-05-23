import PropTypes from "prop-types";
import { useRef, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, View, Text, Animated, Platform } from "react-native";
import ChatBubble from "../../atoms/ChatBubble/ChatBubble";
import ConfirmationActions from "../../molecules/ConfirmationActions/ConfirmationActions";
import MessageActions from "../../molecules/MessageActions/MessageActions";
import { styles } from "./ChatMessages.styles";

const useNative = Platform.OS !== "web";

const TypingDot = ({ delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: useNative,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: useNative,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.typingDot,
        { transform: [{ translateY }], opacity },
      ]}
    />
  );
};

TypingDot.propTypes = { delay: PropTypes.number.isRequired };

const TypingIndicator = () => (
  <View style={styles.typingContainer}>
    <TypingDot delay={0} />
    <TypingDot delay={150} />
    <TypingDot delay={300} />
    <Text style={styles.typingText}>Kuroko está pensando...</Text>
  </View>
);

const ChatMessages = ({
  messages,
  loading,
  onConfirmPending,
  onCancelPending,
  onMessageFeedback,
  historyReady,
}) => {
  const flatListRef = useRef(null);
  const lastMessageId =
    messages.length > 0 ? messages[messages.length - 1].id : null;

  const scrollToBottom = useCallback((animated = false) => {
    const list = flatListRef.current;
    if (!list || messages.length === 0) return;

    const run = () => {
      list.scrollToEnd({ animated });
      if (Platform.OS === "web") {
        list.scrollToOffset?.({ offset: 1e8, animated });
      }
    };

    requestAnimationFrame(run);
    if (Platform.OS === "web") {
      setTimeout(run, 50);
      setTimeout(run, 200);
    }
  }, [messages.length]);

  useFocusEffect(
    useCallback(() => {
      scrollToBottom(false);
    }, [scrollToBottom, lastMessageId])
  );

  useEffect(() => {
    scrollToBottom(false);
  }, [lastMessageId, scrollToBottom]);

  useEffect(() => {
    if (historyReady) {
      scrollToBottom(false);
    }
  }, [historyReady, scrollToBottom]);

  const handleContentSizeChange = useCallback(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  const renderItem = ({ item }) => {
    const showActions =
      item.isBot && item.id !== "welcome" && !item.pendingConfirmation;

    return (
      <View style={styles.messageWrap}>
        <ChatBubble
          message={item.text}
          isBot={item.isBot}
          timestamp={item.timestamp}
          attachments={item.attachments}
          footer={
            showActions ? (
              <MessageActions
                messageText={item.text}
                feedback={item.feedback ?? null}
                onFeedback={(value) => onMessageFeedback?.(item.id, value)}
                disabled={loading}
              />
            ) : null
          }
        />
        {item.isBot && item.pendingConfirmation ? (
          <ConfirmationActions
            pending={item.pendingConfirmation}
            onConfirm={() => onConfirmPending?.(item)}
            onCancel={() => onCancelPending?.(item)}
            disabled={loading}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.list}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
      />
      {loading && <TypingIndicator />}
    </View>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isBot: PropTypes.bool,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      attachments: PropTypes.array,
      pendingConfirmation: PropTypes.object,
      feedback: PropTypes.oneOf(["up", "down", null]),
    })
  ).isRequired,
  loading: PropTypes.bool,
  onConfirmPending: PropTypes.func,
  onCancelPending: PropTypes.func,
  onMessageFeedback: PropTypes.func,
  historyReady: PropTypes.bool,
};

ChatMessages.defaultProps = {
  loading: false,
  onConfirmPending: undefined,
  onCancelPending: undefined,
  onMessageFeedback: undefined,
  historyReady: false,
};

export default ChatMessages;
