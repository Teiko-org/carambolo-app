import PropTypes from "prop-types"
import { Eye, EyeOff } from "lucide-react-native"
import styles from "./ProductListCard.styles"
import { Image, Pressable, Text, View } from "react-native"

const ProductListCard = ({ name, quantity, isAtivo, onToggle, imageUrl }) => {
    return (
        <View style={styles.row}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.thumbnail}
                />
            ) : (
                <View style={styles.thumbnailPlaceholder}>
                    <Text style={styles.thumbnailPlaceholderText}>📷</Text>
                </View>
            )}
            <View style={styles.info}>
                <Pressable onPress={onToggle} hitSlop={8}>
                    {isAtivo
                        ? <Eye size={16} color="#A47032" />
                        : <EyeOff size={16} color="#A47032" />
                    }
                </Pressable>
                <Text style={[styles.name, !isAtivo && styles.nameInactive]}>{name}</Text>
            </View>
            <Text style={[styles.quantity, !isAtivo && styles.quantityInactive]}>{quantity}</Text>
        </View>
    )
}

ProductListCard.propTypes = {
    name: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isAtivo: PropTypes.bool,
    onToggle: PropTypes.func,
    imageUrl: PropTypes.string,

}

ProductListCard.defaultProps = {
    isAtivo: true,
    onToggle: () => { },
}

export default ProductListCard
