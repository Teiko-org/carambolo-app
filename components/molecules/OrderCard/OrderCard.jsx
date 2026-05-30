import PropTypes from "prop-types"
import { View, Text, Modal, Pressable } from "react-native"
import styles from "./OrderCard.styles"
import Button from "../../atoms/Button/Button"
import { useState } from "react";
import OrderSummary from "../../organisms/OrderSummary/OrderSummary";

const OrderCard = ({
    order,
    deliveryDate,
    orderId,
    isGestureMode,
    onOpenDetails,
}) => {

    const [localDetailsOpen, setLocalDetailsOpen] = useState(false);

    const openModal = () => {
        if (isGestureMode) {
            onOpenDetails?.();
            return;
        }
        setLocalDetailsOpen(true);
    };

    const closeModal = () => setLocalDetailsOpen(false);

    const detailsTriggerProps = isGestureMode
        ? { dataSet: { orderDetailsTrigger: String(orderId) } }
        : {};

    return (
        <View style={styles.container}>

            <Text style={styles.bold}>
                {order.name}
                <Text style={{ marginLeft: 5 }} >
                    N° {orderId}
                </Text>
            </Text>

            <Text>
                {order.phone}
            </Text>

            <Text>
                {order.type}
            </Text>

            <Text>
                {deliveryDate}
            </Text>

            <View style={styles.flexRow}>
                <Text style={styles.bold}>
                    {order.price}
                </Text>

                <Pressable
                    {...detailsTriggerProps}
                    onPress={openModal}
                    accessibilityRole="button"
                    accessibilityLabel="Detalhes do pedido"
                >
                    <Button variant="secondary" title="Detalhes" size="small" onPress={openModal} />
                </Pressable>

            </View>

            {!isGestureMode ? (
                <Modal
                    visible={localDetailsOpen}
                    animationType="none"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <OrderSummary onClose={closeModal} order={order.raw} />
                </Modal>
            ) : null}

        </View>
    )
}

OrderCard.propTypes = {
    order: PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        raw: PropTypes.object,
    }).isRequired,
    deliveryDate: PropTypes.string,
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isGestureMode: PropTypes.bool,
    onOpenDetails: PropTypes.func,
}

OrderCard.defaultProps = {
    isGestureMode: false,
    onOpenDetails: undefined,
}

export default OrderCard
