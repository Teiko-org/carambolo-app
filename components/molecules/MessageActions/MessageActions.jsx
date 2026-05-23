import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react-native";
import { copyPlainText } from "../../../utils/copyPlainText";
import { styles } from "./MessageActions.styles";

const ICON = 15;
const STROKE = 2;
const COLOR = "#A47032";
const COLOR_ACTIVE = "#103464";
const COLOR_MUTED = "#C4A574";

const MessageActions = ({ messageText, feedback, onFeedback, disabled }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (disabled) return;
    try {
      const ok = await copyPlainText(messageText);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      void 0;
    }
  }, [disabled, messageText]);

  const handleUp = () => {
    if (disabled) return;
    onFeedback?.(feedback === "up" ? null : "up");
  };

  const handleDown = () => {
    if (disabled) return;
    onFeedback?.(feedback === "down" ? null : "down");
  };

  return (
    <View style={styles.group} accessibilityRole="toolbar">
      <TouchableOpacity
        style={[styles.btn, feedback === "up" && styles.btnActive]}
        onPress={handleUp}
        disabled={disabled}
        activeOpacity={0.6}
        accessibilityLabel="Gostei"
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      >
        <ThumbsUp
          size={ICON}
          color={feedback === "up" ? COLOR_ACTIVE : COLOR_MUTED}
          strokeWidth={STROKE}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, feedback === "down" && styles.btnActive]}
        onPress={handleDown}
        disabled={disabled}
        activeOpacity={0.6}
        accessibilityLabel="Nao gostei"
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      >
        <ThumbsDown
          size={ICON}
          color={feedback === "down" ? COLOR_ACTIVE : COLOR_MUTED}
          strokeWidth={STROKE}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, copied && styles.btnActive]}
        onPress={handleCopy}
        disabled={disabled}
        activeOpacity={0.6}
        accessibilityLabel="Copiar texto"
        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      >
        <Copy
          size={ICON}
          color={copied ? "#6B8F71" : COLOR}
          strokeWidth={STROKE}
        />
      </TouchableOpacity>
      {copied ? <Text style={styles.copiedLabel}>Copiado</Text> : null}
    </View>
  );
};

MessageActions.propTypes = {
  messageText: PropTypes.string.isRequired,
  feedback: PropTypes.oneOf(["up", "down", null]),
  onFeedback: PropTypes.func,
  disabled: PropTypes.bool,
};

MessageActions.defaultProps = {
  feedback: null,
  onFeedback: undefined,
  disabled: false,
};

export default MessageActions;
