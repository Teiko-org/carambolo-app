import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import styles from "./Select.styles"
import { Dropdown } from "react-native-element-dropdown"

const Select = ({ defaultValue, options, selectedValue, setSelectedValue, placeholder, placeholderStyle }) => {
    const getNormalizedValue = (value) => {
        if (value && typeof value === "object" && "value" in value) {
            return value.value
        }
        return value
    }

    const [internalSelectedValue, setInternalSelectedValue] = useState(
        getNormalizedValue(defaultValue)
    )
    const onSelectValueChange = setSelectedValue || setInternalSelectedValue

    useEffect(() => {
        function handleDefaultValue() {
            const normalizedDefaultValue = getNormalizedValue(defaultValue)
            onSelectValueChange(normalizedDefaultValue)
        }
        handleDefaultValue()
    }, [defaultValue, onSelectValueChange])

    return (
        <Dropdown
            data={options}
            labelField="label"
            valueField="value"
            value={selectedValue ?? internalSelectedValue}
            onChange={(optionValue) => onSelectValueChange(optionValue.value)}
            style={styles.select}
            placeholder={placeholder}
            placeholderStyle={placeholderStyle ?? styles.placeholder}
        />
    )
}

Select.propTypes = {
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
    ]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ).isRequired,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setSelectedValue: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderStyle: PropTypes.object,
}

export default Select