import PropTypes from "prop-types";
import { Text, View, Pressable } from "react-native";
import { X } from "lucide-react-native";
import InsightBadge from "../../atoms/InsightBadge/InsightBadge";
import { styles, getCardColors } from "./InsightCard.styles";

const InsightCard = ({ type, title, message, onDismiss }) => {
  const colors = getCardColors(type);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <InsightBadge type={type} />
        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.dismissBtn}>
            <X size={16} color="#888" />
          </Pressable>
        )}
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

InsightCard.propTypes = {
  type: PropTypes.oneOf(["alert", "trend", "opportunity"]).isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
};

InsightCard.defaultProps = {
  title: null,
  onDismiss: null,
};

export default InsightCard;
