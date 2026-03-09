import { Pressable, View, Text } from "react-native"
import styles from "./OrderCard.styles"

const OrderCard = ({ order }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.bold}>
                {order.name}
            </Text>

            <Text>
                {order.phone}
            </Text>

            <Text>
                {order.type}
            </Text>

            <View style={styles.flexRow}>
                <Text style={styles.bold}>
                    {order.price}
                </Text>

                <Pressable>
                    <Text>Detalhes</Text>
                </Pressable>

            </View>

        </View>
    )
}

export default OrderCard