import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"
import { useProducts } from "../hooks/useProducts"
import ProductListContainer from "../components/organisms/ProductListContainer/ProductListContainer"

const Products = () => {
	const {
		products,
		weeklyLabel,
		weeklyPrice,
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useProducts()

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: 15,
					backgroundColor: "#FFEEE7",
				}}
			>
				<ActivityIndicator size="large" color="#103464" />
				<Text style={{ marginTop: 16, fontSize: 18, color: "#103464", fontWeight: "600" }}>
					Carregando produtos...
				</Text>
			</View>
		)
	}

	if (isError) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: 20,
					backgroundColor: "#FFEEE7",
				}}
			>
				<Text
					style={{
						fontSize: 22,
						fontWeight: "700",
						color: "#103464",
						textAlign: "center",
					}}
				>
					Nao foi possivel carregar os produtos.
				</Text>
				<Pressable
					onPress={refetch}
					style={{
						marginTop: 18,
						backgroundColor: "#C79D53",
						borderWidth: 2,
						borderColor: "#A47032",
						borderRadius: 999,
						paddingHorizontal: 24,
						paddingVertical: 12,
					}}
				>
					<Text style={{ fontSize: 18, fontWeight: "700", color: "#000000" }}>
						{isRefetching ? "Recarregando..." : "Tentar novamente"}
					</Text>
				</Pressable>
			</View>
		)
	}

	return (
		<View style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 20, backgroundColor: "#FFEEE7" }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<ProductListContainer
					title="Listagem de Produtos"
					products={products}
					weeklyLabel={weeklyLabel}
					weeklyPrice={weeklyPrice}
					addButtonText="ADICIONAR NOVO PRODUTO"
					emptyMessage="Nenhum produto cadastrado no momento."
				/>
			</ScrollView>
		</View>
	)
}

export default Products
