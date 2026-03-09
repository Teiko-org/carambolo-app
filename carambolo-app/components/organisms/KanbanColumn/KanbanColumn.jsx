import { Pressable, View, Text } from "react-native"
import styles from "./KanbanColumn.styles"
import OrderCard from "../../molecules/OrderCard/OrderCard"


const KanbanColumn = ({ orders }) => {
    return (
        <View style={{ paddingTop: 100, width: "80%" }}>

            <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Pedidos Pagos
                </Text>
            </View>

            <View style={styles.background}>
                <View style={styles.container}>

                    <OrderCard order={{
                        name: "Raíne Neres Teixeira Jardim",
                        phone: "+55 (11) 968090-282",
                        type: "Retirada",
                        price: "R$999,99"
                    }} />

                    <OrderCard order={{
                        name: "Raíne Neres Teixeira Jardim",
                        phone: "+55 (11) 968090-282",
                        type: "Retirada",
                        price: "R$999,99"
                    }} />

                    <OrderCard order={{
                        name: "Raíne Neres Teixeira Jardim",
                        phone: "+55 (11) 968090-282",
                        type: "Retirada",
                        price: "R$999,99"
                    }} />

                </View>

            </View>


        </View>
    )
}

export default KanbanColumn