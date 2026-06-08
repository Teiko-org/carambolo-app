import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import ProductListCard from "../../molecules/ProductListCard/ProductListCard"
import styles from "./ProductListContainer.styles"

const ProductListContainer = ({
    title,
    products,
    emptyMessage,
    onToggleStatus,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
                {products.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>{emptyMessage}</Text>
                    </View>
                ) : (
                    products.map((product, index) => (
                        <ProductListCard
                            key={`${product.name}-${index}`}
                            name={product.name}
                            quantity={product.quantity}
                            isAtivo={product.isAtivo}
                            imageUrl={product.imageUrl}
                            onToggle={() => onToggleStatus(product)}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    )
}

ProductListContainer.propTypes = {
    title: PropTypes.string,
    products: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            isAtivo: PropTypes.bool,
            type: PropTypes.string,
        })
    ),
    emptyMessage: PropTypes.string,
    onToggleStatus: PropTypes.func,
}

ProductListContainer.defaultProps = {
    title: "Listagem de Produtos",
    products: [],
    emptyMessage: "Nenhum produto encontrado.",
    onToggleStatus: () => { },
}

export default ProductListContainer
