import PropTypes from "prop-types";
import { Text, Pressable } from "react-native";
import { styles } from "./PromptPill.styles";

const PromptPill = ({ label, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

PromptPill.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PromptPill;
