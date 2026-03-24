import PropTypes from "prop-types"
import { Pressable, Text, View } from "react-native"
import styles from "./ButtonSideMenu.styles"

const ButtonSideMenu = ({ onPress }) => {
    return (
        <View>
            <Pressable style={styles.sideMenuButton} onPress={onPress}>
                <Text style={styles.sideMenuButtonText}>|||</Text>
            </Pressable>
        </View>
    )
}

ButtonSideMenu.propTypes = {
    onPress: PropTypes.func.isRequired,
}

export default ButtonSideMenu
