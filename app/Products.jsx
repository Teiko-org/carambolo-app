import { Plus, Eye } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"

const Products = () => {
	return (
		<View style={styles.screen}>
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Text style={styles.cardHeaderText}>Listagem de Produtos</Text>
				</View>

				<View style={styles.productRow}>
					<View style={styles.productInfo}>
						<Eye size={18} color="#A47032" />
						<Text style={styles.productName}>Bolo de Cenoura c/ cobertura de Chocolate</Text>
					</View>

					<Text style={styles.productAmount}>99</Text>
				</View>

				<View style={styles.weeklyRow}>
					<Text style={styles.weeklyText}>Fornada da Semana</Text>
					<Text style={styles.weeklyPrice}>R$ 999,99</Text>
				</View>

				<View style={styles.buttonWrapper}>
					<Pressable style={styles.addButton}>
						<Text style={styles.addButtonText}>ADICIONAR NOVO PRODUTO</Text>
						<Plus size={22} color="#000000" strokeWidth={2.4} />
					</Pressable>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingHorizontal: 15,
		paddingBottom: 20,
		backgroundColor: "#FFEEE7",
	},
	card: {
		flex: 1,
		borderWidth: 2,
		borderColor: "#A47032",
		borderRadius: 16,
		backgroundColor: "#F0DFD8",
		overflow: "hidden",
	},
	cardHeader: {
		backgroundColor: "#103464",
		borderBottomWidth: 1.5,
		borderBottomColor: "#A47032",
		paddingHorizontal: 14,
		paddingVertical: 24,
	},
	cardHeaderText: {
		color: "#A47032",
		fontSize: 35,
		fontWeight: "700",
	},
	productRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#E8DBD5",
		backgroundColor: "#F9EFEA",
	},
	productInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
		paddingRight: 12,
	},
	productName: {
		color: "#161616",
		fontSize: 27,
		fontWeight: "500",
		flex: 1,
	},
	productAmount: {
		color: "#111111",
		fontSize: 27,
		fontWeight: "700",
	},
	weeklyRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 14,
		backgroundColor: "#F6E9E3",
	},
	weeklyText: {
		fontSize: 32,
		fontWeight: "700",
		color: "#161616",
	},
	weeklyPrice: {
		fontSize: 32,
		fontWeight: "700",
		color: "#161616",
	},
	buttonWrapper: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		paddingBottom: 12,
	},
	addButton: {
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
	},
	addButtonText: {
		fontSize: 23,
		fontWeight: "700",
		color: "#000000",
	},
})

export default Products
