import { Pressable, Text } from "react-native"
import { useState } from "react"
import { buttonStyles, textStyles } from "./Button.styles"

const Button = ({ title, onPress, variant, size }) => {
    const [pressed, setPressed] = useState(false)

    return (
        variant == "primary" ? (
            <Pressable 
              onPress={onPress}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={pressed ? buttonStyles(size).primaryPressed : buttonStyles(size).primary}
            >
                <Text style={pressed ? textStyles(size).primaryPressed : textStyles(size).primary}>{title}</Text>
            </Pressable>
        ) : (
            <Pressable 
              onPress={onPress}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={pressed ? buttonStyles(size).secondaryPressed : buttonStyles(size).secondary}
            >
                <Text style={pressed ? textStyles(size).secondaryPressed : textStyles(size).secondary}>{title}</Text>
            </Pressable>
        )
    )
}

export default Button