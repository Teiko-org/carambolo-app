import PropTypes from "prop-types"
import { Text, View } from "react-native"
import { useMemo } from "react"
import styles from "./DashChartContainer.styles"
import Select from "../../atoms/Select/Select"

const DashChartContainer = ({
    headerText,
    children,
    itemOptions,
    anosOptions,
    selectedTipoItem,
    setSelectedTipoItem,
    selectedAno,
    setSelectedAno,
}) => {
    const defaultItemValue = useMemo(() => {
        return selectedTipoItem || itemOptions?.[0]?.value
    }, [itemOptions, selectedTipoItem])

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={styles.headerText}>{headerText}</Text>

                <View style={styles.filters}>
                    <Select
                        options={itemOptions}
                        defaultValue={defaultItemValue}
                        selectedValue={selectedTipoItem}
                        setSelectedValue={setSelectedTipoItem}
                    />
                    <Select
                        options={anosOptions}
                        defaultValue={selectedAno}
                        selectedValue={selectedAno}
                        setSelectedValue={setSelectedAno}
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
    selectedTipoItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setSelectedTipoItem: PropTypes.func,
    selectedAno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setSelectedAno: PropTypes.func,
}

export default DashChartContainer
