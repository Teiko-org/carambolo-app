import { Text, View } from "react-native"
import { styles } from "./DashOrderCard/DashOrderCard.styles"
import Button from "../atoms/Button/Button"

const DashOrderCard = ({ title, ordersQuantity, ordersStatus }) => {
    const getLabelByStatus = (status) => {
        switch (status) {
            case "PENDENTE":
                return "pendentes";
            case "CONCLUIDO":
                return "concluidos";
            default:
                return "Desconhecido";
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.footer}>
                <Button title="Ver pedidos" />
                <Text>x{ordersQuantity} pedidos {getLabelByStatus(ordersStatus)}</Text>
            </View>
        </View>
    )
}

export default DashOrderCard