import { ScrollView, Text, View } from "react-native"
import styles from "./DashMostOrderedContainer.styles"
import Button from "../../atoms/Button/Button"
import MostOrderedCard from "../../molecules/MostOrderedCard/MostOrderedCard"

const DashMostOrderedContainer = ({ title, filterOptions, orders }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                {/* <View style={styles.filtersContainer}>
                    {
                        // adicionar filtros
                    }
                </View> */}
            </View>
            <ScrollView style={styles.cardsContainer}>
                {orders.map((order) => (
                    <MostOrderedCard
                        key={order.id ?? order.title}
                        cardTitle={order.title}
                        quantity={order.quantity}
                        amount={order.amount}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

export default DashMostOrderedContainer