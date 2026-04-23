import PropTypes from "prop-types"
import { Text, View } from "react-native"
import { styles } from "./DashOrderCard.styles"
import Button from "../../atoms/Button/Button"

const DashOrderCard = ({ title, ordersQuantity }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.footer}>
                <Button title="Ver pedidos" />
                <Text>x{ordersQuantity} pedidos pendentes</Text>
            </View>
        </View>
    )
}

DashOrderCard.propTypes = {
    title: PropTypes.string.isRequired,
    ordersQuantity: PropTypes.number.isRequired,
}

export default DashOrderCard