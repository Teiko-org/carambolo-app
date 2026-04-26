import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
        paddingRight: 12,
    },
    name: {
        color: "#161616",
        fontSize: 14,
        fontWeight: "500",
        flex: 1,
    },
    nameInactive: {
        color: "#A0A0A0",
    },
    quantity: {
        color: "#111111",
        fontSize: 14,
        fontWeight: "600",
    },
    quantityInactive: {
        color: "#A0A0A0",
    },
})

export default styles
