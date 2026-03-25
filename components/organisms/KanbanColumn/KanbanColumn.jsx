import PropTypes from "prop-types"
import { View, Text } from "react-native"
import styles from "./KanbanColumn.styles"
import OrderCard from "../../molecules/OrderCard/OrderCard"


const KanbanColumn = ({ title }) => {
    return (
        <View style={{ width: 280, height: "100%" }}>

            <View style={styles.category}>
                <Text style={styles.categoryText}>
                    {title}
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

KanbanColumn.propTypes = {
    title: PropTypes.string.isRequired,
}

export default KanbanColumn