import PropTypes from "prop-types"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import styles from "./DashLastOrdersContainer.styles"
import OrderCard from "../../molecules/OrderCard/OrderCard"
import {
    getPedidoBoloCompletoById,
    getPedidoFornadaDetalhe,
    mapFornadaDetalheToSummary,
} from "../../../services/dashboardService"

const buildLoadOrderDetails = (order) => async () => {
    if (order.tipoProduto === "FORNADA") {
        if (!order.pedidoFornadaId) {
            throw new Error("Pedido de fornada sem identificador.");
        }
        const detail = await getPedidoFornadaDetalhe(order.pedidoFornadaId);
        return mapFornadaDetalheToSummary(detail, order.resumoId ?? order.id);
    }
    if (!order.pedidoBoloId) {
        throw new Error("Pedido de bolo sem identificador.");
    }
    return getPedidoBoloCompletoById(order.pedidoBoloId);
}

const DashLastOrdersContainer = ({
    title,
    subtitle,
    orders,
    isLoading,
    isError,
    error,
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
            {isLoading ? (
                <View style={[styles.cardsContainer, { alignItems: "center", paddingVertical: 32 }]}>
                    <ActivityIndicator size="large" color="#A47032" />
                    <Text style={{ marginTop: 12, color: "#103464" }}>Carregando pedidos…</Text>
                </View>
            ) : isError ? (
                <View style={[styles.cardsContainer, { paddingVertical: 24 }]}>
                    <Text style={{ color: "#103464", textAlign: "center" }}>
                        {error?.message ?? "Erro ao carregar últimos pedidos."}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.cardsContainer}
                    contentContainerStyle={styles.cardsContent}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled
                >
                    {(orders || []).length === 0 ? (
                        <Text style={{ color: "#103464", textAlign: "center", paddingVertical: 16 }}>
                            Nenhum pedido recente encontrado.
                        </Text>
                    ) : (
                        orders.map((order, index) => (
                            <OrderCard
                                key={order.resumoId ?? order.id ?? index}
                                order={order}
                                orderId={order.resumoId ?? order.id}
                                onLoadDetails={buildLoadOrderDetails(order)}
                            />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    )
}

const orderItem = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    resumoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pedidoBoloId: PropTypes.number,
    pedidoFornadaId: PropTypes.number,
    tipoProduto: PropTypes.string,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
})

DashLastOrdersContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    orders: PropTypes.arrayOf(orderItem).isRequired,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    error: PropTypes.shape({ message: PropTypes.string }),
}

DashLastOrdersContainer.defaultProps = {
    isLoading: false,
    isError: false,
    error: null,
}

export default DashLastOrdersContainer
