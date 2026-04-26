import PropTypes from "prop-types"
import { Plus } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"
import ProductListCard from "../../molecules/ProductListCard/ProductListCard"
import styles from "./ProductListContainer.styles"

const ProductListContainer = ({
    title,
    products,
    weeklyLabel,
    weeklyPrice,
    addButtonText,
    onAddProduct,
    emptyMessage,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
            </View>

            {products.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>{emptyMessage}</Text>
                </View>
            ) : (
                products.map((product, index) => (
                    <ProductListCard key={`${product.name}-${index}`} name={product.name} quantity={product.quantity} />
                ))
            )}

            <View style={styles.weeklyRow}>
                <Text style={styles.weeklyText}>{weeklyLabel}</Text>
                <Text style={styles.weeklyPrice}>{weeklyPrice}</Text>
            </View>

            <View style={styles.buttonWrapper}>
                <Pressable style={styles.addButton} onPress={onAddProduct}>
                    <Text style={styles.addButtonText}>{addButtonText}</Text>
                    <Plus size={22} color="#000000" strokeWidth={2.4} />
                </Pressable>
            </View>
        </View>
    )
}

ProductListContainer.propTypes = {
    title: PropTypes.string,
    products: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ),
    weeklyLabel: PropTypes.string,
    weeklyPrice: PropTypes.string,
    addButtonText: PropTypes.string,
    onAddProduct: PropTypes.func,
    emptyMessage: PropTypes.string,
}

ProductListContainer.defaultProps = {
    title: "Listagem de Produtos",
    products: [],
    weeklyLabel: "Fornada da Semana",
    weeklyPrice: "R$ 0,00",
    addButtonText: "ADICIONAR NOVO PRODUTO",
    onAddProduct: () => {},
    emptyMessage: "Nenhum produto encontrado.",
}

export default ProductListContainer
