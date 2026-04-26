import PropTypes from "prop-types";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import styles from "./ButtonSideMenuItem.styles";

const ButtonSideMenuItem = ({
    icon = null,
    text,
    selected = false,
    setSelected,
    exit = false,
    route = "",
    compact = false,
    isAssistantCta = false,
}) => {
    const router = useRouter();

    const handlePress = () => {
        setSelected(text);

        if (route && route !== "#") {
            router.push(route);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={styles(selected, exit, compact, isAssistantCta).button}
        >
            {icon}
            <Text style={styles(selected, exit, compact, isAssistantCta).text}>
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
    exit: PropTypes.bool,
    route: PropTypes.string,
    compact: PropTypes.bool,
    isAssistantCta: PropTypes.bool,
};

export default ButtonSideMenuItem;
