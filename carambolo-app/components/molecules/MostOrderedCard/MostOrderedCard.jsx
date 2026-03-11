import { Image, Text, View } from "react-native";
import styles from "./MostOrderedCard.styles";

const MostOrderedCard = ({ cardTitle, quantity, amount }) => {
    return (
        <View style={styles.cardContainer}>
            <Image
                source={require("../../../assets/bolo.png")}
                style={styles.image}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.cardTitle}>
                    {cardTitle}
                </Text>
                <View style={styles.footer}>
                    <View style={styles.quantity}>
                        <Text style={{fontWeight: "bold"}}>Quantidade</Text>
                        <Text>{quantity}</Text>
                    </View>
                    <View style={styles.amount}>
                        <Text style={{fontWeight: "bold"}}>Valor</Text>
                        <Text>R${amount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MostOrderedCard;
