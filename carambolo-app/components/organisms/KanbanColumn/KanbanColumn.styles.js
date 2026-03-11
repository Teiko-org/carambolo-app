import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFE7DD",
        width: "100%",
        height: "100%",
        padding: 10,

        borderRadius: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#A47032",

        display: "flex",
        flexDirection: "column",
        gap: 10,
    },

    background: {

        backgroundColor: "#103464",
        width: "100%",
        height: "100%",
        padding: 2,

        borderRadius: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#A47032",

        borderTopLeftRadius: 0,

        display: "flex",
        flexDirection: "column",
        gap: 3,

    },

    category: {
        backgroundColor: "#103464",
        width: "fit-content",

        borderRadius: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#A47032",

        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,

        display: "flex",
        alignItems: "center",
    },

    categoryText: {
        color: "#A47032",
        fontSize: 18,
        fontWeight: "bold",

        padding: 10,
        paddingHorizontal: 20,
    }
    
})

export default styles;