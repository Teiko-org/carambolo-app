import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E8DBD5",
        backgroundColor: "#F9EFEA",
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
        fontSize: 27,
        fontWeight: "500",
        flex: 1,
    },
    quantity: {
        color: "#111111",
        fontSize: 27,
        fontWeight: "700",
    },
})

export default styles
