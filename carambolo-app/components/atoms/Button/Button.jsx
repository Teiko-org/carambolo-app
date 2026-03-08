import { Pressable, Text } from "react-native"
import { buttonStyles, textStyles } from "./Button.styles"

const Button = ({ title, onPress, variant, size }) => {
    return (
        variant == "primary" ? (
            <Pressable onPress={onPress} style={buttonStyles(size).primary}>
                <Text style={textStyles(size).primary}>{title}</Text>
            </Pressable>
        ) : (
            <Pressable onPress={onPress} style={buttonStyles(size).secondary}>
                <Text style={textStyles(size).secondary}>{title}</Text>
            </Pressable>
        )
    )
}

export default Button