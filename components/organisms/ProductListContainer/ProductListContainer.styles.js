import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderWidth: 2,
        borderColor: "#A47032",
        borderRadius: 16,
        backgroundColor: "#F0DFD8",
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#103464",
        borderBottomWidth: 1.5,
        borderBottomColor: "#A47032",
        paddingHorizontal: 14,
        paddingVertical: 24,
    },
    headerText: {
        color: "#A47032",
        fontSize: 35,
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

export default styles
