import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import styles from "./Select.styles"
import { Dropdown } from "react-native-element-dropdown"

const Select = ({ defaultValue, options, selectedValue, setSelectedValue }) => {

    useEffect(() => {
        async function handleDefaultValue() {
            await setSelectedValue(defaultValue)
        }
        handleDefaultValue()
    }, [])

    return (
        <Dropdown
            data={options}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={(optionValue) => setSelectedValue(optionValue.value)}
            style={styles.select}
        />
    )
}

Select.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ).isRequired,
}

export default Select