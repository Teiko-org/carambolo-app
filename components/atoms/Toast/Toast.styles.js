import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 16,
        left: 20,
        right: 20,
        zIndex: 999,
        alignItems: "center",
    },
    inner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#2E7D32",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    message: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
})

export default styles
