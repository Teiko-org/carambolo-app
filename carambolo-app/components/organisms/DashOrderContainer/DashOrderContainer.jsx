import { ScrollView, Text, View } from "react-native"
import styles from "./DashOrderContainer.styles"
import DashOrderCard from "../../molecules/DashOrderCard/DashOrderCard"
import Button from "../../atoms/Button/Button"

const DashOrderContainer = ({
    title,
    cards: orders,
    icon,
    shouldShowFooterButton,
    remainingOrders,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {icon}
                {title}
            </Text>
            <ScrollView contentContainerStyle={{ gap: 12 }}>
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

export default DashOrderContainer