import { ScrollView, Text, View } from "react-native"
import styles from "./DashOrderContainer.styles"
import DashOrderCard from "../../molecules/DashOrderCard/DashOrderCard"
import Button from "../../atoms/Button/Button"
import PropTypes from "prop-types"

const DashOrderContainer = ({
    title,
    cards: orders,
    icon,
    shouldShowFooterButton,
    remainingOrders,
    isError,
    isLoading,
    error
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {icon}
                {title}
            </Text>
            <ScrollView
                style={styles.cardsContainer}
                contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled
            >
                {orders.map((order, index) => (
                    <DashOrderCard
                        key={index}
                        title={order.title}
                        ordersQuantity={order.ordersQuantity}
                        ordersStatus={order.ordersStatus}
                    />
                ))}
            </ScrollView>
            {shouldShowFooterButton && (
                <View style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
                    <Button size="large" title={`Ver outros ${remainingOrders} pedidos`} />
                </View>
            )}
        </View >
    )
}

DashOrderContainer.propTypes = {
    title: PropTypes.string,
    cards: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                massaId: PropTypes.number,
                nomeMassa: PropTypes.string,
                quantidade: PropTypes.number
            })
        ),
        PropTypes.arrayOf(
            PropTypes.shape({
                recheioId: PropTypes.number,
                nomeRecheio: PropTypes.string,
                quantidade: PropTypes.number
            })
        )
    ]),
    icon: PropTypes.element,
    shouldShowFooterButton: PropTypes.bool,
    remainingOrders: PropTypes.number
}


DashOrderContainer.defaultProps = {
    title: null,
    cards: [],
    icon: null,
    shouldShowFooterButton: false,
    remainingOrders: 0
}

export default DashOrderContainer