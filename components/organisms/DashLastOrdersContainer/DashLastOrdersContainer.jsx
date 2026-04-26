import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
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
            <ScrollView
                style={styles.cardsContainer}
                contentContainerStyle={styles.cardsContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled
            >
                {(orders || []).map((order, index) => (
                    <OrderCard
                        key={order.id ?? index}
                        order={order}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const orderItem = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
})

DashLastOrdersContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    orders: PropTypes.arrayOf(orderItem).isRequired,
}

export default DashLastOrdersContainer
