import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFEEE7",
        borderWidth: 2,
        borderColor: "#D4B076",
        borderStyle: "solid",
        borderRadius: 16,
        height: "12%",
        width: "90%",
        justifyContent: "space-between",
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        paddingLeft: 6 
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    }
})