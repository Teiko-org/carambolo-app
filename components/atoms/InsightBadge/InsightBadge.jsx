import PropTypes from "prop-types";
import { Text, View } from "react-native";
import { styles, getBadgeColors } from "./InsightBadge.styles";

const LABELS = {
  alert: "Alerta",
  trend: "Tendência",
  opportunity: "Oportunidade",
};

const InsightBadge = ({ type }) => {
  const colors = getBadgeColors(type);

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {LABELS[type] || type}
      </Text>
    </View>
  );
};

InsightBadge.propTypes = {
  type: PropTypes.oneOf(["alert", "trend", "opportunity"]).isRequired,
};

export default InsightBadge;
