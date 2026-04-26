import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#A47032",
        borderRadius: 20,
        backgroundColor: "#FFE7DD",
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#103464",
        paddingHorizontal: 14,
        paddingVertical: 18,
    },
    headerText: {
        color: "#C79D53",
        fontSize: 20,
        fontWeight: "600",
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    emptyState: {
        paddingHorizontal: 14,
        paddingVertical: 16,
    },
    emptyStateText: {
        color: "#5C4A42",
        fontSize: 14,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#A47032",
        marginHorizontal: 0,
    },
    weeklyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    weeklyText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#161616",
    },
    weeklyPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#161616",
    },
    buttonWrapper: {
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#FFEEE7",
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
        width: "80%",
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
    },
})

export default styles
