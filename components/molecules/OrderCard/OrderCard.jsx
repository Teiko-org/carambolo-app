import PropTypes from "prop-types"
import { View, Text, Modal } from "react-native"
import styles from "./OrderCard.styles"
import Button from "../../atoms/Button/Button"
import { useState } from "react";
import OrderSummary from "../../organisms/OrderSummary/OrderSummary";

const OrderCard = ({ order }) => {

    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

    const openModal = () => setIsOrderSummaryOpen(true);
    
    const closeModal = () => setIsOrderSummaryOpen(false);

    return (
        <View style={styles.container}>
            <Text style={styles.bold}>
                {order.name}
            </Text>

            <Text>
                {order.phone}
            </Text>

            <Text>
                {order.type}
            </Text>

            <View style={styles.flexRow}>
                <Text style={styles.bold}>
                    {order.price}
                </Text>

                <Button variant="secondary" title="Detalhes" size="small" onPress={openModal} />

            </View>

            <Modal
                visible={isOrderSummaryOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <OrderSummary onClose={closeModal} />
            </Modal>

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
    }).isRequired,
}

export default OrderCard