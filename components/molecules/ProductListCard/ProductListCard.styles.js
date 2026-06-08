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
    thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
},
thumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#F0E0D0",
    justifyContent: "center",
    alignItems: "center",
},
thumbnailPlaceholderText: {
    fontSize: 18,
} })

export default styles
