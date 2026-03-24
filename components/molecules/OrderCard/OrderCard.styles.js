import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFEEE7",
        width: "100%",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A47032",
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },

    bold: {
        fontSize: 16, 
        fontWeight: "bold"
    },

    flexRow: {

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    }
    
    
})

export default styles;