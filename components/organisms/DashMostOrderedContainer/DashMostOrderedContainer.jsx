import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import styles from "./DashMostOrderedContainer.styles"
import MostOrderedCard from "../../molecules/MostOrderedCard/MostOrderedCard"


const DashMostOrderedContainer = ({
    title,
    orders,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                {/* <View style={styles.filtersContainer}>
                    {
                        // adicionar filtros
                    }
                </View> */}
            </View>
            <ScrollView style={styles.cardsContainer}>
                {orders.map((order) => (
                    <MostOrderedCard
                        key={order.id ?? order.title}
                        cardTitle={order.title}
                        quantity={order.quantity}
                        amount={order.amount}
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

DashMostOrderedContainer.propTypes = {
    title: PropTypes.string.isRequired,
    filterOptions: PropTypes.arrayOf(selectOption),
    orders: PropTypes.arrayOf(orderItem).isRequired,
}

export default DashMostOrderedContainer
