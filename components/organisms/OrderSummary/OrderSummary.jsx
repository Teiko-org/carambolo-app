import PropTypes from "prop-types"
import { Pressable, ScrollView, Text, View } from "react-native"
import styles from "./OrderSummary.styles"

const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
};

const OrderSummary = ({ onClose, order }) => {

    return (

        <View style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", paddingTop: 100, flex: 1 }}>

            <Pressable
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                }}
                onPress={onClose}
            />

            <View style={styles.header}>

                <Pressable onPress={onClose} style={{ backgroundColor: "#A47032", width: 100, height: 5, borderRadius: 25 }} >
                    {/* <Text style={{ color: "white", textAlign: "center" }}>Fechar</Text> */}
                </Pressable>

                <Text style={styles.headerTitle}>Número do Pedido: {order?.id}</Text>

                <Text style={styles.headerText}>Bolo de Cenoura c/ cobertura de Chocolate</Text>

            </View>

            <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 50 }}>

                <View>

                    <Text style={styles.title}>Montagem</Text>

                    <View style={{ flexDirection: "row", gap: 20, width: "90%", flexWrap: "wrap" }}>
                        <Text style={styles.label}>Tamanho: <Text style={styles.data}>{order?.bolo?.tamanho}</Text></Text>

                        <Text style={styles.label}>Formato: <Text style={styles.data}>{order?.bolo?.formato}</Text></Text>

                        <Text style={styles.label}>Massa: <Text style={styles.data}>{order?.bolo?.massa?.sabor}</Text></Text>

                        <Text style={[styles.label, { width: "40%" }]}>Recheio: <Text style={styles.data}>{order?.bolo?.recheioPedido?.sabor1} e {order?.bolo?.recheioPedido?.sabor2}</Text></Text>
                    </View>

                </View>

                <View>

                    <Text style={styles.title}>Decoração</Text>

                    <View>
                        <Text style={styles.data}>Nenhuma imagem de referência adicionada</Text>

                        <Text style={[styles.label, { paddingTop: 20 }]}>Observações</Text>

                        <Text style={styles.data}>{order?.observacao}</Text>

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

                    <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>

                        <Text style={styles.label}>O pedido será: <Text style={styles.data}>{order?.tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}</Text></Text>

                        <Text style={styles.label}>Data: <Text style={styles.data}>{formatDate(order?.dataPrevisaoEntrega)}</Text></Text>

                    </View>

                    <View>

                        <Text style={styles.subtitle}>Dados do Solicitante</Text>

                        <View style={{ gap: 10 }}>

                            <Text style={styles.label}>Nome do solicitante: <Text style={styles.data}>{order?.nomeCliente}</Text></Text>

                            <Text style={styles.label}>Telefone: <Text style={styles.data}>{order?.telefoneCliente}</Text></Text>

                        </View>

                    </View>

                    <View>

                        <Text style={styles.subtitle}>Endereço</Text>

                        <View style={{ flexDirection: "row", gap: 30, flexWrap: "wrap", width: "80%" }}>

                            <View>
                                <Text style={styles.label}>CEP</Text>
                                <Text style={styles.data}>{order?.endereco?.cep}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Estado</Text>
                                <Text style={styles.data}>{order?.endereco?.estado}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Cidade</Text>
                                <Text style={styles.data}>{order?.endereco?.cidade}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Bairro</Text>
                                <Text style={styles.data}>{order?.endereco?.bairro}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Rua</Text>
                                <Text style={[styles.data, { width: "70%" }]}>{order?.endereco?.logradouro}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Número</Text>
                                <Text style={styles.data}>{order?.endereco?.numero}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Complemento</Text>
                                <Text style={styles.data}>{order?.endereco?.complemento || "N/A"}</Text>
                            </View>

                        </View>

                    </View>

                </View>

            </ScrollView>

        </View>

    )
}

OrderSummary.propTypes = {
    onClose: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
}

export default OrderSummary