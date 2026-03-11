import { Text, View } from "react-native"
import styles from "./DashChartContainer.styles"
import MonthlyOrdersChart from "../../molecules/MonthlyOrdersChart/MonthlyOrdersChart"

const DashChartContainer = () => {

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={styles.headerText}>Massas Mais Pedidas Por Mês - 2025</Text>
                <View style={styles.filters}></View>
            </View>
            <MonthlyOrdersChart/>
        </View>
    )
}

export default DashChartContainer
