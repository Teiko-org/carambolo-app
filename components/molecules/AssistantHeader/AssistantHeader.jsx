import PropTypes from "prop-types";
import { Text, View, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import SparkleIcon from "../../atoms/SparkleIcon/SparkleIcon";
import { styles } from "./AssistantHeader.styles";

const AssistantHeader = ({ onBack }) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.backBtn}>
          <ChevronLeft size={22} color="#D4B076" />
        </Pressable>
      )}
      <View style={styles.avatar}>
        <SparkleIcon size={20} color="#FFEEE7" />
        <View style={styles.onlineIndicator} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>Kuroko Assistant</Text>
        <Text style={styles.subtitle}>
          Assistente Inteligente · Carambolos
        </Text>
      </View>
    </View>
  );
};

AssistantHeader.propTypes = {
  onBack: PropTypes.func,
};

AssistantHeader.defaultProps = {
  onBack: null,
};

export default AssistantHeader;
