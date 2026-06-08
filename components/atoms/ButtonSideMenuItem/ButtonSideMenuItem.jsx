import PropTypes from "prop-types";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import styles from "./ButtonSideMenuItem.styles";

const ButtonSideMenuItem = ({
    icon = null,
    text,
    selected = false,
    setSelected,
    route = "",
    compact = false,
    isAssistantCta = false,
    onAfterPress = null,
}) => {
    const router = useRouter();

    const handlePress = () => {
        setSelected(text);

        if (route && route !== "#") {
            router.push(route);
        }

        if (onAfterPress) {
            onAfterPress();
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={styles(selected, compact, isAssistantCta).button}
        >
            {icon}
            <Text style={styles(selected, compact, isAssistantCta).text}>
                {text}
            </Text>
        </Pressable>
    );
};

ButtonSideMenuItem.propTypes = {
    icon: PropTypes.node,
    text: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    setSelected: PropTypes.func.isRequired,
    route: PropTypes.string,
    compact: PropTypes.bool,
    isAssistantCta: PropTypes.bool,
    onAfterPress: PropTypes.func,
};

export default ButtonSideMenuItem;
