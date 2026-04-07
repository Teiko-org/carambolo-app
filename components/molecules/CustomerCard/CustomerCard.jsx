import PropTypes from "prop-types"
import { Image, Text, View } from "react-native"
import styles from "./CustomerCard.styles"
import customerImage from "../../../assets/lets-icons_user-cicrle-duotone.png"

const CustomerCard = ({
    customerName,
    customerTotalOrders,
    customerPhoneNumber
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={customerImage} />
            </View>
            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.text}>Nome</Text>
                    <Text style={styles.text}>{customerName}</Text>
                </View>
                <View>
                    <Text style={styles.ordersQuantity}>
                        Total de Pedidos: {customerTotalOrders}
                    </Text>
                    <Text style={styles.text}>
                        {customerPhoneNumber}
                    </Text>
                </View>
            </View>
        </View>
    )
}

CustomerCard.propTypes = {
    customerName: PropTypes.string.isRequired,
    customerTotalOrders: PropTypes.number.isRequired,
    customerPhoneNumber: PropTypes.string.isRequired
}

export default CustomerCard
