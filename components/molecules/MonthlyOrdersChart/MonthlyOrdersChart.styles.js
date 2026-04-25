import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    chartWrapper: {
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
    },
    chartColumn: {
        width: "100%",
        gap: 10,
    },
    chartItem: {
        width: "100%",
        gap: 4,
    },
    labelsRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    monthLabel: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "600",
        color: "#1F1F1F",
        width: 80,
    },
    itemLabelText: {
        flex: 1,
        textAlign: "right",
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "500",
        color: "#1F1F1F",
    },
    metricsRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bar: {
        height: 25,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#A47032",
    },
    ordersCount: {
        width: 95,
        textAlign: "right",
        fontSize: 13,
        lineHeight: 17,
        fontWeight: "400",
        color: "#1F1F1F",
    },
})

export default styles;