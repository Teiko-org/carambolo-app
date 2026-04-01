import { ScrollView, View } from "react-native"
import ProductListContainer from "../components/organisms/ProductListContainer/ProductListContainer"

const mockProducts = [
	{
		name: "Bolo de Cenoura c/ cobertura de Chocolate",
		quantity: 99,
	},
]

const Products = () => {
	return (
		<View style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 20, backgroundColor: "#FFEEE7" }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<ProductListContainer
					title="Listagem de Produtos"
					products={mockProducts}
					weeklyLabel="Fornada da Semana"
					weeklyPrice="R$ 999,99"
					addButtonText="ADICIONAR NOVO PRODUTO"
				/>
			</ScrollView>
		</View>
	)
}

export default Products
