import PropTypes from "prop-types";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SparkleIcon from "../SparkleIcon/SparkleIcon";
import { styles } from "./ChatBubble.styles";

const ChatBubble = ({ message, isBot, timestamp }) => {
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <View style={[styles.wrapper, isBot ? styles.wrapperBot : styles.wrapperUser]}>
      {isBot && (
        <View style={styles.avatar}>
          <SparkleIcon size={14} color="#FFEEE7" />
        </View>
      )}
      {isBot ? (
        <LinearGradient
          colors={["#30344F", "#103464"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bubbleBot}
        >
          <Text style={styles.textBot}>{message}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.bubbleUser}>
          <Text style={styles.textUser}>{message}</Text>
        </View>
      )}
      {timestamp && (
        <Text
          style={[
            styles.timestamp,
            isBot ? styles.timestampBot : styles.timestampUser,
          ]}
        >
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.string.isRequired,
  isBot: PropTypes.bool,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ChatBubble.defaultProps = {
  isBot: false,
  timestamp: null,
};

export default ChatBubble;
