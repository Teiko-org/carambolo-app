import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
    sideMenuContainer: {

        width: "100%",
        height: "100%",

        flexDirection: "row",
        alignItems: "center",
    },
    
    container: {
        backgroundColor: "#103464",
        width: "60%",
        height: "100%",
        paddingBottom: 65,

        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A47032",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        
    },

    sideMenuButton: {
        backgroundColor: "#103464",
        width: "6%",
        height: "8%",

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