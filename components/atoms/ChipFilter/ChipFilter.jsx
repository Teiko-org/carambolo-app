import { Pressable, Text } from "react-native"
import styles from "./ChipFilter.styles"

const ChipFilter = ({ selected, text, onPress }) => {
    return (
        <Pressable onPress={() => onPress()} style={selected ? styles.selected : styles.default}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )

}

export default ChipFilter
