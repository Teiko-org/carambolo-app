import { StyleSheet } from "react-native";

export const buttonStyles = (size) => StyleSheet.create({
    primary: {},
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#A47032",
        borderStyle: "solid",
        borderRadius: 12,
        marginTop: 16,
        paddingHorizontal: 6,
        paddingVertical: 4
    }
})

export const textStyles = (size) => StyleSheet.create({
    primary: {},
    secondary: {
        color: "#A47032",
        fontSize: size == "small" ? 12 : 16,
        fontWeight: "bold",
    },
})

export default { buttonStyles, textStyles }