import PropTypes from "prop-types"
import { Text, View } from "react-native"
import styles from "./DashChartContainer.styles"
import Select from "../../atoms/Select/Select"

const DashChartContainer = ({ headerText, children, itemOptions, anosOptions }) => {



    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={styles.headerText}>{headerText}</Text>

                <View style={styles.filters}>
                    <Select
                        options={itemOptions}
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

const selectOption = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
})

DashChartContainer.propTypes = {
    headerText: PropTypes.string.isRequired,
    children: PropTypes.node,
    itemOptions: PropTypes.arrayOf(selectOption).isRequired,
    anosOptions: PropTypes.arrayOf(selectOption).isRequired,
}

export default DashChartContainer
