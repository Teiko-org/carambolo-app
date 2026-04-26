import PropTypes from "prop-types"
import { Text } from "react-native"
import styles from "./ButtonSideMenuItem.styles"
import { Link } from "expo-router"

const ButtonSideMenuItem = ({
    icon = null,
    text,
    selected = false,
    setSelected,
    exit = false,
    route = "",
}) => {
    const handleSelect = () => {
        setSelected(text)
    }

    return (
        <Link
            style={
                exit
                    ? styles(selected, exit).buttonExit
                    : styles(selected, exit).buttonSelected
            }
            onPress={handleSelect}
            href={`/${route}`}
        >
            <Text style={exit ? styles(selected, exit).buttonExitText : styles(selected, exit).buttonText}>
                {icon}{text}
            </Text>
        </Link>
    )
}

ButtonSideMenuItem.propTypes = {
    icon: PropTypes.node,
    text: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    setSelected: PropTypes.func.isRequired,
    exit: PropTypes.bool,
    route: PropTypes.string,
}

export default ButtonSideMenuItem
