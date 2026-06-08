import { useState } from "react";
import PropTypes from "prop-types";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PromptPill from "../../atoms/PromptPill/PromptPill";
import { styles } from "./PromptBar.styles";

const FADE_END_THRESHOLD = 4;

const PromptBar = ({ prompts, onSelect, bgColor = "#FFEEE7" }) => {
  const [showRightFade, setShowRightFade] = useState(true);
  const [showLeftFade, setShowLeftFade] = useState(false);

  if (!prompts || prompts.length === 0) return null;

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const atStart = contentOffset.x <= FADE_END_THRESHOLD;
    const atEnd =
      contentOffset.x + layoutMeasurement.width >=
      contentSize.width - FADE_END_THRESHOLD;
    setShowLeftFade(!atStart);
    setShowRightFade(!atEnd);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={32}
      >
        {prompts.map((item, index) => (
          <PromptPill
            key={index}
            label={item.label}
            onPress={() => onSelect(item.prompt)}
          />
        ))}
      </ScrollView>

      {showLeftFade && (
        <LinearGradient
          colors={[bgColor, `${bgColor}00`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fade, styles.fadeLeft]}
          pointerEvents="none"
        />
      )}

      {showRightFade && (
        <LinearGradient
          colors={[`${bgColor}00`, bgColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fade, styles.fadeRight]}
          pointerEvents="none"
        />
      )}
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
  bgColor: PropTypes.string,
};

PromptBar.defaultProps = {
  prompts: [],
  bgColor: "#FFEEE7",
};

export default PromptBar;
