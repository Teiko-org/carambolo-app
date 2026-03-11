import { Text, View } from "react-native"
import styles from "./DashChartContainer.styles"
import Select from "../../atoms/Select/Select"

const DashChartContainer = ({ headerText, children, massasOptions, anosOptions }) => {

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={styles.headerText}>{headerText}</Text>

                <View style={styles.filters}>
                    <Select
                        options={massasOptions}
                        defaultValue={{
                            label: "Massas",
                            value: "massas"
                        }}
                    />
                    <Select
                        options={anosOptions}
                        defaultValue={{
                            label: "Ano",
                            value: "ano"
                        }}
                    />
                </View>
            </View>
            {children}
        </View>
    )
}

export default DashChartContainer
