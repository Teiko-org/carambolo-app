import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    sideMenuButton: {
        backgroundColor: "#103464",
        width: 20,
        height: 60,

        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A47032",

        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

    },

    sideMenuButtonText: {
        color: "#A47032",
        fontSize: 16,
        fontWeight: "bold",

        paddingBottom: 5,
    }

})

export default styles;