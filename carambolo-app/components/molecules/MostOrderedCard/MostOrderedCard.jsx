import { Image, Text, View } from "react-native"
import styles from "./MostOrderedCard.styles"

const MostOrderedCard = ({ cardTitle, quantity, amount }) => {
    return (
        <View style={styles.cardContainer}>
            <Image src={require("../../../assets/bolo.png")} style={{ width: "100%", height: 100 }} />

            <View style={styles.infoContainer}>
                <Text style={styles.cardTitle}>
                    {cardTitle}
                </Text>
                <View style={styles.footer}>
                    <View style={styles.quantity}>
                        <Text>
                            Quantidade
                        </Text>
                        <Text>
                            {quantity}
                        </Text>
                    </View>
                    <View style={styles.amount}>
                        <Text>
                            Valor
                        </Text>
                        <Text>
                            R${amount}
                        </Text>
                    </View>
                </View>
            </View>




        </View>
    )
}

export default MostOrderedCard
