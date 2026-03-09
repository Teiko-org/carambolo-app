import { Text, View } from "react-native"
import styles from "./DashOrderContainer.styles"

const DashOrderContainer = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

export default DashOrderContainer