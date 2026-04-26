import { useEffect, useRef } from "react"
import { Animated, Text, View } from "react-native"
import { CheckCircle } from "lucide-react-native"
import PropTypes from "prop-types"
import styles from "./Toast.styles"

const Toast = ({ visible, message = "Operação realizada com sucesso!" }) => {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(-20)).current

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
            ]).start()
        }
    }, [visible])

    return (
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
            <View style={styles.inner}>
                <CheckCircle size={18} color="#fff" />
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    )
}

export default Toast

Toast.propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.string,
}
