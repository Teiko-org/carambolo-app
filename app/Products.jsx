import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { useState } from "react"
import { Plus } from "lucide-react-native"
import { useProducts } from "../hooks/useProducts"
import ProductListContainer from "../components/organisms/ProductListContainer/ProductListContainer"
import AddProductModal from "../components/organisms/AddProductModal/AddProductModal"
import Toast from "../components/atoms/Toast/Toast"

const Products = () => {
	const {
		products,
		isLoading,
		isError,
		refetch,
		isRefetching,
		toggleStatus,
	} = useProducts()

	const handleToggleStatus = ({ id, type, isAtivo }) => {
		toggleStatus({ id, type, isAtivo: !isAtivo })
	}


const [modalVisible, setModalVisible] = useState(false)
	const [toastVisible, setToastVisible] = useState(false)

	const showToast = () => {
		setToastVisible(true)
		setTimeout(() => setToastVisible(false), 3000)
	}

	const handleSuccess = () => {
    showToast()
}


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
		<View style={{ flex: 1, backgroundColor: "#FFEEE7" }}>
			<Toast visible={toastVisible} message="Produto cadastrado com sucesso!" />

			<View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 }}>
				<ProductListContainer
					title="Listagem de Produtos"
					products={products}
					emptyMessage="Nenhum produto cadastrado no momento."
					onToggleStatus={handleToggleStatus}
				/>
			</View>

			<View style={{ alignItems: "center", paddingVertical: 16, backgroundColor: "#FFEEE7" }}>
				<Pressable
					onPress={() => setModalVisible(true)}
					style={{
						backgroundColor: "#C79D53",
						borderWidth: 2,
						borderColor: "#A47032",
						borderRadius: 999,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						paddingHorizontal: 18,
						paddingVertical: 10,
						width: "80%",
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: "600", color: "#000000" }}>
						ADICIONAR NOVO PRODUTO
					</Text>
					<Plus size={18} color="#000000" strokeWidth={2.4} />
				</Pressable>
			</View>

			<AddProductModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSuccess={handleSuccess}
			/>
		</View>
	)
}

export default Products
