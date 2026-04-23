import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    header: {
        backgroundColor: "#103464",
        width: "100%",
        height: 100,

        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A47032",

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        gap: 10,

        position: "static",

    },

    headerTitle: {
        color: "#A47032",
        fontSize: 20,
        fontWeight: "bold",


    },

    headerText: {

        color: "white",
        fontSize: 15,


    },

    body: {

        backgroundColor: "#FFEEE7",
        width: "100%",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    title: {

        color: "#103464",
        fontSize: 20,
        fontWeight: "bold",

        paddingTop: 10,
        paddingBottom: 15,

    },

    subtitle: {
        color: "#103464",
        fontSize: 16,
        fontWeight: "bold",

        paddingTop: 20,
        paddingBottom: 10,
    },

    label: {

        color: "#103464",
        fontWeight: "bold",
        fontSize: 15,
    },

    data: {

        color: "black",
        fontWeight: "normal",
        fontSize: 15,

    },
})

export default styles;