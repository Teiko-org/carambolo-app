import PropTypes from "prop-types"
import { View, Text, Modal, Pressable } from "react-native"
import styles from "./OrderCard.styles"
import Button from "../../atoms/Button/Button"
import { useState, useCallback, useRef } from "react";
import OrderSummary from "../../organisms/OrderSummary/OrderSummary";

const OrderCard = ({
    order,
    deliveryDate,
    orderId,
    isGestureMode,
    onOpenDetails,
    onLoadDetails,
    onDetailsButtonLayout,
}) => {

    const [localDetailsOpen, setLocalDetailsOpen] = useState(false);
    const [detailOrder, setDetailOrder] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const detailsButtonRef = useRef(null);

    const reportDetailsBounds = useCallback(() => {
        if (!onDetailsButtonLayout) return;
        detailsButtonRef.current?.measureInWindow?.((x, y, width, height) => {
            onDetailsButtonLayout({ x, y, width, height });
        });
    }, [onDetailsButtonLayout]);

    const closeModal = useCallback(() => {
        setLocalDetailsOpen(false);
        setDetailOrder(null);
        setDetailError(null);
        setLoadingDetail(false);
    }, []);

    const openModal = useCallback(async () => {
        if (isGestureMode) {
            onOpenDetails?.();
            return;
        }

        setLocalDetailsOpen(true);
        setDetailError(null);

        if (onLoadDetails) {
            setDetailOrder(null);
            setLoadingDetail(true);
            try {
                const loaded = await onLoadDetails();
                setDetailOrder(loaded);
            } catch (e) {
                console.warn("[OrderCard] Falha ao carregar detalhes:", e);
                setDetailError("Não foi possível carregar este pedido. Tente de novo.");
            } finally {
                setLoadingDetail(false);
            }
            return;
        }

        setDetailOrder(order.raw ?? null);
    }, [isGestureMode, onOpenDetails, onLoadDetails, order.raw]);

    const detailsTriggerProps = isGestureMode
        ? { dataSet: { orderDetailsTrigger: String(orderId) } }
        : {};

    const summaryOrder = onLoadDetails ? detailOrder : order.raw;

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
                    ref={detailsButtonRef}
                    {...detailsTriggerProps}
                    onPress={openModal}
                    onLayout={reportDetailsBounds}
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
                    <OrderSummary
                        onClose={closeModal}
                        order={summaryOrder}
                        isLoading={loadingDetail}
                        loadError={detailError}
                    />
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
    onLoadDetails: PropTypes.func,
    onDetailsButtonLayout: PropTypes.func,
}

OrderCard.defaultProps = {
    isGestureMode: false,
    onOpenDetails: undefined,
    onLoadDetails: undefined,
    onDetailsButtonLayout: undefined,
}

export default OrderCard
