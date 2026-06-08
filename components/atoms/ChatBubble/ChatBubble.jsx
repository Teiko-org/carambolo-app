import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, Linking, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Download } from "lucide-react-native";
import SparkleIcon from "../SparkleIcon/SparkleIcon";
import { getApiBaseUrl } from "../../../services/api/api";
import { styles } from "./ChatBubble.styles";

const buildUrl = (endpoint) => {
  const base = getApiBaseUrl();
  if (!endpoint) return base;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${base}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
};

const AttachmentButton = ({ attachment }) => {
  const url = buildUrl(attachment.endpoint);

  const handlePress = async () => {
    try {
      if (Platform.OS === "web") {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {
      void 0;
    }
  };

  return (
    <TouchableOpacity
      style={styles.attachmentBtn}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Download size={16} color="#103464" />
      <Text style={styles.attachmentText}>{attachment.label}</Text>
    </TouchableOpacity>
  );
};

AttachmentButton.propTypes = {
  attachment: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    filename: PropTypes.string,
  }).isRequired,
};

const ChatBubble = ({ message, isBot, timestamp, attachments, footer }) => {
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const hasAttachments = isBot && Array.isArray(attachments) && attachments.length > 0;

  return (
    <View style={[styles.wrapper, isBot ? styles.wrapperBot : styles.wrapperUser]}>
      {isBot ? (
        <View style={styles.botColumn}>
          <View style={styles.avatar}>
            <SparkleIcon size={14} color="#FFEEE7" />
          </View>
          <LinearGradient
            colors={["#30344F", "#103464"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bubbleBot}
          >
            <Text style={styles.textBot}>{message}</Text>
            {hasAttachments && (
              <View style={styles.attachmentsContainer}>
                {attachments.map((att, idx) => (
                  <AttachmentButton key={`att-${idx}`} attachment={att} />
                ))}
              </View>
            )}
          </LinearGradient>
          {timestamp && footer ? (
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
              {footer}
            </View>
          ) : null}
          {timestamp && !footer ? (
            <Text style={[styles.timestamp, styles.timestampBotStandalone]}>
              {formatTime(timestamp)}
            </Text>
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.bubbleUser}>
            <Text style={styles.textUser}>{message}</Text>
          </View>
          {timestamp ? (
            <Text style={[styles.timestamp, styles.timestampUser]}>
              {formatTime(timestamp)}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.string.isRequired,
  isBot: PropTypes.bool,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string.isRequired,
      endpoint: PropTypes.string.isRequired,
      filename: PropTypes.string,
    })
  ),
  footer: PropTypes.node,
};

ChatBubble.defaultProps = {
  isBot: false,
  timestamp: null,
  attachments: [],
  footer: null,
};

export default ChatBubble;
