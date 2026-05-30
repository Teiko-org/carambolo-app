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
        position: "relative",
        backgroundColor: "#103464",
        width: "100%",
        height: "90%",
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
    },

    scrollFadeBottom: {
        position: "absolute",
        left: 2,
        right: 2,
        bottom: 2,
        height: 44,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 6,
        backgroundImage:
            "linear-gradient(180deg, rgba(255, 231, 221, 0) 0%, rgba(255, 231, 221, 0.92) 55%, rgba(255, 231, 221, 1) 100%)",
    },

    scrollFadeTop: {
        position: "absolute",
        left: 2,
        right: 2,
        top: 2,
        height: 20,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundImage:
            "linear-gradient(0deg, rgba(255, 231, 221, 0) 0%, rgba(255, 231, 221, 0.75) 100%)",
    },

    scrollHintText: {
        color: "#6b3f1a",
        fontSize: 11,
        fontWeight: "700",
    },
    
})

export default styles;