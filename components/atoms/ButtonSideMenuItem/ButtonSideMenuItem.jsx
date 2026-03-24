import PropTypes from "prop-types"
import styles from "./ButtonSideMenuItem.styles"
import { Link } from "expo-router"
// import { MdOutlineSpaceDashboard } from "react-icons/md";

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
            {/* <MdOutlineSpaceDashboard /> */}

            {icon}
            {text}
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
