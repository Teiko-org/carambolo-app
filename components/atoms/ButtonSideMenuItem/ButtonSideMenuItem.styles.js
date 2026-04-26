import { StyleSheet } from "react-native";

const styles = (selected, exit) => StyleSheet.create({
    buttonSelected: {
        backgroundColor: selected ? "#FFEEE7" : "#103464",
        width: "60%",
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        padding: 10,
    },

    buttonExit: {
        backgroundColor: exit ? "#D70000" : "#103464",
        width: "50%",
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        padding: 10,
    },

    buttonText: {
        color: selected ? "#103464" : "#A47032",
        fontSize: 16,
        fontWeight: "bold",
    },

    buttonExitText: {
        color: exit ? "white" : "#A47032",
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default styles;
