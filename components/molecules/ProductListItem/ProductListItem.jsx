import PropTypes from "prop-types"
import { Eye } from "lucide-react-native"
import { Text, View } from "react-native"
import styles from "./ProductListItem.styles"

const ProductListItem = ({ name, quantity }) => {
    return (
        <View style={styles.row}>
            <View style={styles.info}>
                <Eye size={18} color="#A47032" />
                <Text style={styles.name}>{name}</Text>
            </View>

            <Text style={styles.quantity}>{quantity}</Text>
        </View>
    )
}

ProductListItem.propTypes = {
    name: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default ProductListItem
