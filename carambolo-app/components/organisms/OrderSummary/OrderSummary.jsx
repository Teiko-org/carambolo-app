import { Text, View } from "react-native"
import styles from "./OrderSummary.styles"

const OrderSummary = (onClick) => {

    return (

        <View>

            <View style={styles.header}>

                <Text style={styles.headerTitle}>Número do Pedido: 9999999</Text>

                <Text style={styles.headerText}>Bolo de Cenoura c/ cobertura de Chocolate</Text>

            </View>

            <View style={styles.body}>

                <View>

                    <Text style={styles.title}>Montagem</Text>

                    <View style={{ flexDirection: "row", gap: 20, width: "90%", flexWrap: "wrap" }}>
                        <Text style={styles.label}>Tamanho: <Text style={styles.data}>13cm</Text></Text>

                        <Text style={styles.label}>Formato: <Text style={styles.data}>Redondo</Text></Text>

                        <Text style={styles.label}>Massa: <Text style={styles.data}>Red-Velvet</Text></Text>

                        <Text style={[styles.label, {width: "40%"}]}>Recheio: <Text style={styles.data}>Brigadeiro de Pistache com Redução de Frutas Vermelhas</Text></Text>
                    </View>

                </View>

                <View>

                    <Text style={styles.title}>Decoração</Text>

                    <View>
                        <Text style={styles.data}>Nenhuma imagem de referência adicionada</Text>

                        <Text style={styles.label}>Observações</Text>

                        <Text style={styles.data}>Redondo</Text>

                    </View>

                </View>

                <View>

                    <Text style={styles.title}>Adicionais</Text>

                    <View>
                        <Text style={styles.data}>Checks</Text>
                    </View>

                </View>

                <View>

                    <Text style={styles.title}>Dados da Entrega</Text>

                    <View>

                        <Text style={styles.label}>O pedido será: <Text style={styles.data}>Entrega</Text></Text>

                        <Text style={styles.label}>Data: <Text style={styles.data}>15/03/2026</Text></Text>

                    </View>

                    <View>

                        <Text style={styles.subtitle}>Dados do Solicitante</Text>
                        
                        <Text style={styles.label}>Nome do solicitante: <Text style={styles.data}>Murilo Do Nascimento Barros</Text></Text>

                        <Text style={styles.label}>Telefone: <Text style={styles.data}> (11) 99999-9999</Text></Text>

                    </View>

                    <View>

                        <Text style={styles.subtitle}>Endereço</Text>
                        
                        <Text style={styles.label}>CEP: <Text style={styles.data}>01234-567</Text></Text>

                        <Text style={styles.label}>Estado: <Text style={styles.data}>SP</Text></Text>

                        <Text style={styles.label}>Cidade: <Text style={styles.data}>São Paulo</Text></Text>

                        <Text style={styles.label}>Bairro: <Text style={styles.data}>Jardim Silva</Text></Text>

                        <Text style={styles.label}>Rua: <Text style={styles.data}>Rua Antônio Marques da Silva</Text></Text>

                        <Text style={styles.label}>Número: <Text style={styles.data}>123</Text></Text>

                        <Text style={styles.label}>Complemento: <Text style={styles.data}>Apto 101</Text></Text>

                    </View>

                </View>

            </View>

        </View>

    )
}

export default OrderSummary