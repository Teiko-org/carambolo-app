import { useEffect, useState } from "react"
import styles from "./Select.styles"
import { Dropdown } from "react-native-element-dropdown";

const Select = ({ defaultValue, options }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue)

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

export default Select