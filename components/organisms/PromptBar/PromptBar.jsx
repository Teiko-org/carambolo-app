import PropTypes from "prop-types";
import { ScrollView, View } from "react-native";
import PromptPill from "../../atoms/PromptPill/PromptPill";
import { styles } from "./PromptBar.styles";

const PromptBar = ({ prompts, onSelect }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <View style={styles.scrollView}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {prompts.map((item, index) => (
          <PromptPill
            key={index}
            label={item.label}
            onPress={() => onSelect(item.prompt)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

PromptBar.propTypes = {
  prompts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      prompt: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func.isRequired,
};

PromptBar.defaultProps = {
  prompts: [],
};

export default PromptBar;
