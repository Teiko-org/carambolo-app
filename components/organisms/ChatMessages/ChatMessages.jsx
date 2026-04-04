import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { FlatList, View, Text, Animated, Platform } from "react-native";
import ChatBubble from "../../atoms/ChatBubble/ChatBubble";
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

const ChatMessages = ({ messages, loading }) => {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderItem = ({ item }) => (
    <ChatBubble
      message={item.text}
      isBot={item.isBot}
      timestamp={item.timestamp}
    />
  );

  return (
    <View style={styles.list}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    })
  ).isRequired,
  loading: PropTypes.bool,
};

ChatMessages.defaultProps = {
  loading: false,
};

export default ChatMessages;
