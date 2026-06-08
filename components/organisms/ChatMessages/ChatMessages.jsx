import PropTypes from "prop-types";
import { useRef, useEffect, useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, View, Text, Animated, Platform, Pressable } from "react-native";
import { ChevronDown } from "lucide-react-native";
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

const JumpToBottomFab = ({ visible, onPress }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      mountedRef.current = true;
      setMounted(true);
      opacity.setValue(0);
      translateY.setValue(12);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: useNative,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: useNative,
          damping: 20,
          stiffness: 260,
          mass: 0.7,
        }),
      ]).start();
      return undefined;
    }

    if (!mountedRef.current) return undefined;

    const hide = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: useNative,
      }),
      Animated.timing(translateY, {
        toValue: 12,
        duration: 200,
        useNativeDriver: useNative,
      }),
    ]);

    hide.start(({ finished }) => {
      if (finished) {
        mountedRef.current = false;
        setMounted(false);
      }
    });

    return () => hide.stop();
  }, [visible, opacity, translateY]);

  if (!mounted) return null;

  return (
    <Animated.View
      style={[
        styles.jumpToBottomBtn,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <Pressable
        onPress={onPress}
        style={styles.jumpToBottomPressable}
        accessibilityRole="button"
        accessibilityLabel="Ir para a última mensagem"
        hitSlop={8}
      >
        <ChevronDown size={22} color="#A47032" strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
};

JumpToBottomFab.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

const ChatMessages = ({
  messages,
  loading,
  onConfirmPending,
  onCancelPending,
  onMessageFeedback,
  historyReady,
}) => {
  const flatListRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const lastScrolledMessageIdRef = useRef(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const lastMessageId =
    messages.length > 0 ? messages[messages.length - 1].id : null;
  const NEAR_BOTTOM_PX = 120;

  const setPinnedToBottom = useCallback((pinned) => {
    isNearBottomRef.current = pinned;
    setShowJumpToBottom(!pinned);
  }, []);

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
    }
  }, [messages.length]);

  const scrollToBottomIfPinned = useCallback(
    (animated = false) => {
      if (isNearBottomRef.current) {
        scrollToBottom(animated);
      }
    },
    [scrollToBottom]
  );

  const handleScroll = useCallback((event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const visibleHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;
    if (contentHeight <= visibleHeight + 1) {
      setPinnedToBottom(true);
      return;
    }
    const distanceFromBottom =
      contentHeight - visibleHeight - contentOffset.y;
    const nearBottom = distanceFromBottom <= NEAR_BOTTOM_PX;
    isNearBottomRef.current = nearBottom;
    setShowJumpToBottom((prev) => {
      const next = !nearBottom;
      return prev === next ? prev : next;
    });
  }, [setPinnedToBottom]);

  const handleJumpToBottom = useCallback(() => {
    setPinnedToBottom(true);
    scrollToBottom(true);
  }, [scrollToBottom, setPinnedToBottom]);

  useFocusEffect(
    useCallback(() => {
      setPinnedToBottom(true);
      scrollToBottom(false);
    }, [scrollToBottom, setPinnedToBottom])
  );

  useEffect(() => {
    if (lastMessageId == null) return;
    if (lastScrolledMessageIdRef.current === lastMessageId) return;
    lastScrolledMessageIdRef.current = lastMessageId;
    setPinnedToBottom(true);
    scrollToBottom(false);
  }, [lastMessageId, scrollToBottom, setPinnedToBottom]);

  useEffect(() => {
    if (historyReady) {
      setPinnedToBottom(true);
      scrollToBottom(false);
    }
  }, [historyReady, scrollToBottom, setPinnedToBottom]);

  useEffect(() => {
    if (loading) {
      scrollToBottomIfPinned(false);
    }
  }, [loading, scrollToBottomIfPinned]);

  const handleContentSizeChange = useCallback(() => {
    scrollToBottomIfPinned(false);
  }, [scrollToBottomIfPinned]);

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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        ListFooterComponent={loading ? TypingIndicator : null}
      />
      <JumpToBottomFab visible={showJumpToBottom} onPress={handleJumpToBottom} />
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
