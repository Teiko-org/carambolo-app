import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import styles from "./DashTopCustomersContainer.styles"
import CustomerCard from "../../molecules/CustomerCard/CustomerCard"

const DashTopCustomersContainer = ({
    title,
    subtitle,
    customers,
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
                {customers.map((customer) => (
                    <CustomerCard
                        key={customer.id}
                        customerName={customer.nome}
                        customerTotalOrders={customer.pedidosTotais}
                        customerPhoneNumber={customer.telefone}
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

DashTopCustomersContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    filterOptions: PropTypes.arrayOf(selectOption),
    customers: PropTypes.arrayOf(orderItem).isRequired,
}

export default DashTopCustomersContainer
