import { ScrollView, Text, View } from "react-native"
import styles from "./DashOrderContainer.styles"
import DashOrderCard from "../../molecules/DashOrderCard/DashOrderCard"
import Button from "../../atoms/Button/Button"
import PropTypes from "prop-types"

const DashOrderContainer = ({
    title,
    orders,
    icon,
    shouldShowFooterButton,
    remainingOrders,
    isError,
    isLoading,
    error
}) => {
    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{icon}{title}</Text>
                <Text>Carregando pedidos...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{icon}{title}</Text>
                <Text>{error?.message ?? "Erro ao carregar pedidos."}</Text>
            </View>
        )
    }

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
                {(orders || []).map((order, index) => (
                    <DashOrderCard
                        key={index}
                        title={order.nomeMassa || order.nomeRecheio}
                        ordersQuantity={order.quantidade}
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
    orders: PropTypes.oneOfType([
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
    remainingOrders: PropTypes.number,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.shape({
        message: PropTypes.string
    })
}


DashOrderContainer.defaultProps = {
    title: null,
    orders: [],
    icon: null,
    shouldShowFooterButton: false,
    remainingOrders: 0,
    isError: false,
    isLoading: false,
    error: null
}

export default DashOrderContainer