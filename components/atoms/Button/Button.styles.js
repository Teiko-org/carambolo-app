import { StyleSheet } from "react-native";

export const buttonStyles = (size) => StyleSheet.create({
    primary: {
        backgroundColor: "blue",
    },
    primaryPressed: {
        backgroundColor: "darkblue",
        opacity: 0.7,
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#A47032",
        borderStyle: "solid",
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 4,
        width: size == "small" ? 80 : 190,
        alignItems: "center",
        justifyContent: "center",
    },
    secondaryPressed: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D4B076",
        borderStyle: "solid",
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 4,
        width: size == "small" ? 80 : 190,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
    }
})

export const textStyles = (size) => StyleSheet.create({
    primary: {},
    primaryPressed: {},
    secondary: {
        color: "#A47032",
        fontSize: size == "small" ? 12 : 16,
        fontWeight: "bold",
    },
    secondaryPressed: {
        color: "#D4B076",
        fontSize: size == "small" ? 12 : 16,
        fontWeight: "bold",
        opacity: 0.7,
    }
})

export default { buttonStyles, textStyles }