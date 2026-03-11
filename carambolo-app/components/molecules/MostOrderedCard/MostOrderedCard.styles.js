import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        padding: 12,
        columnGap: 12,
    },
    image: {
        width: 140,
        height: 160,
        borderRadius: 8,
        borderColor: "#A47032",
        borderWidth: 2,
        borderStyle: "solid",
    },
    infoContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    quantity: {
        flexDirection: "column",
    },
    amount: {
        flexDirection: "column",
        alignItems: "flex-end",
    },
});

export default styles;
