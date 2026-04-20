import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    chartWrapper: {
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    chartRow: {
        position: "relative",
        width: "100%",
        minHeight: 360,
    },
    chartArea: {
        width: 260,
    },
    labelsColumn: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 105,
        zIndex: 2,
    },
    itemLabelRow: {
        height: 34,
        justifyContent: "center",
    },
    itemLabelText: {
        fontSize: 11,
        color: "#1f1f1f",
    },
})

export default styles;