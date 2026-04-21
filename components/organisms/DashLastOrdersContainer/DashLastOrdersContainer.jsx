import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import CustomerCard from "../../molecules/CustomerCard/CustomerCard"
import styles from "./DashLastOrdersContainer.styles"
import OrderCard from "../../molecules/OrderCard/OrderCard"

const DashLastOrdersContainer = ({
    title,
    subtitle,
    orders,
}) => {

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                <Text style={styles.headerSubtitle}>
                    {subtitle}
                </Text>
            </View>
            <ScrollView style={styles.cardsContainer}>
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const selectOption = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
})

const orderItem = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
})

DashLastOrdersContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    filterOptions: PropTypes.arrayOf(selectOption),
    orders: PropTypes.arrayOf(orderItem).isRequired,
}

export default DashLastOrdersContainer
