import { Plus, Eye } from "lucide-react-native"
import { Pressable, ScrollView, Text, View } from "react-native"

const Products = () => {
	return (
		<View style={{ flex: 1, paddingHorizontal: 15, paddingBottom: 20, backgroundColor: "#FFEEE7" }}>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<View
					style={{
						flex: 1,
						borderWidth: 2,
						borderColor: "#A47032",
						borderRadius: 16,
						backgroundColor: "#F0DFD8",
						overflow: "hidden",
					}}
				>
					<View
						style={{
							backgroundColor: "#103464",
							borderBottomWidth: 1.5,
							borderBottomColor: "#A47032",
							paddingHorizontal: 14,
							paddingVertical: 24,
						}}
					>
						<Text style={{ color: "#A47032", fontSize: 35, fontWeight: "700" }}>Listagem de Produtos</Text>
				</View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingHorizontal: 12,
							paddingVertical: 12,
							borderBottomWidth: 1,
							borderBottomColor: "#E8DBD5",
							backgroundColor: "#F9EFEA",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 8,
								flex: 1,
								paddingRight: 12,
							}}
						>
						<Eye size={18} color="#A47032" />
							<Text style={{ color: "#161616", fontSize: 27, fontWeight: "500", flex: 1 }}>
								Bolo de Cenoura c/ cobertura de Chocolate
							</Text>
					</View>

						<Text style={{ color: "#111111", fontSize: 27, fontWeight: "700" }}>99</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingHorizontal: 14,
							paddingVertical: 14,
							backgroundColor: "#F6E9E3",
						}}
					>
						<Text style={{ fontSize: 32, fontWeight: "700", color: "#161616" }}>Fornada da Semana</Text>
						<Text style={{ fontSize: 32, fontWeight: "700", color: "#161616" }}>R$ 999,99</Text>
					</View>

					<View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 12 }}>
						<Pressable
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
								width: "82%",
							}}
						>
							<Text style={{ fontSize: 23, fontWeight: "700", color: "#000000" }}>ADICIONAR NOVO PRODUTO</Text>
							<Plus size={22} color="#000000" strokeWidth={2.4} />
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

export default Products
