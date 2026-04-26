import { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native"
import { X } from "lucide-react-native"
import PropTypes from "prop-types"
import { useAddProduct } from "../../../hooks/useAddProduct"
import styles from "./AddProductModal.styles"

const TIPOS = ["Fornada", "Decoracao"]

const AddProductModal = ({ visible, onClose, onSuccess }) => {
    const [produto, setProduto] = useState("")
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState("")
    const [categoriaFornada, setCategoriaFornada] = useState("")

    const [nomeDecoracao, setNomeDecoracao] = useState("")
    const [categoriaDecoracao, setCategoriaDecoracao] = useState("")
    const [observacoesDecoracao, setObservacoesDecoracao] = useState("")
    const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([])

    const resetFields = () => {
        setProduto("")
        setDescricao("")
        setValor("")
        setCategoriaFornada("")
        setNomeDecoracao("")
        setCategoriaDecoracao("")
        setObservacoesDecoracao("")
        setAdicionaisSelecionados([])
    }

    const { tipo, setTipo, adicionais, submit, isLoading } = useAddProduct({
        onSuccess: () => {
            resetFields()
            onClose()
            onSuccess?.()
        },
    })

    const handleChangeTipo = (t) => {
        setTipo(t)
        resetFields()
    }

    const toggleAdicional = (adicional) => {
        setAdicionaisSelecionados((prev) => {
            const exists = prev.some((a) => a.id === adicional.id)
            return exists ? prev.filter((a) => a.id !== adicional.id) : [...prev, adicional]
        })
    }

    const handleSubmit = () => {
        if (!tipo) {
            Alert.alert("Atenção", "Selecione um tipo de produto.")
            return
        }

        if (tipo === "Fornada") {
            if (!produto.trim()) {
                Alert.alert("Atenção", "Preencha o nome do produto.")
                return
            }
            if (!valor.trim()) {
                Alert.alert("Atenção", "Preencha o valor do produto.")
                return
            }
            submit({ produto, descricao, valor, categoria: categoriaFornada })
        } else {
            if (!nomeDecoracao.trim()) {
                Alert.alert("Atenção", "Preencha o nome da decoração.")
                return
            }
            submit({
                nome: nomeDecoracao,
                categoria: categoriaDecoracao,
                observacao: observacoesDecoracao,
                adicionais: adicionaisSelecionados,
            })
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Cadastrar Produto</Text>
                        <Pressable onPress={onClose} hitSlop={8}>
                            <X size={22} color="#A47032" />
                        </Pressable>
                    </View>

                    {/* Tipo selector */}
                    <View style={styles.tipoRow}>
                        {TIPOS.map((t) => (
                            <Pressable
                                key={t}
                                style={[styles.tipoButton, tipo === t && styles.tipoButtonActive]}
                                onPress={() => handleChangeTipo(t)}
                            >
                                <Text style={[styles.tipoButtonText, tipo === t && styles.tipoButtonTextActive]}>
                                    {t === "Fornada" ? "Fornada" : "Decoração"}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View>
                            {tipo === "Fornada" && (
                                <View>
                                    <View style={styles.field}>
                                        <Text style={styles.label}>Nome do produto</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={produto}
                                            onChangeText={setProduto}
                                            placeholder="Ex.: Bolo de Cenoura"
                                            placeholderTextColor="#B0A09A"
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>Descrição</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={descricao}
                                            onChangeText={setDescricao}
                                            placeholder="Descreva o produto..."
                                            placeholderTextColor="#B0A09A"
                                            multiline
                                            numberOfLines={3}
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>Categoria</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={categoriaFornada}
                                            onChangeText={setCategoriaFornada}
                                            placeholder="Ex.: Bolo, Torta..."
                                            placeholderTextColor="#B0A09A"
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>Valor (R$)</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={valor}
                                            onChangeText={setValor}
                                            placeholder="0,00"
                                            placeholderTextColor="#B0A09A"
                                            keyboardType="decimal-pad"
                                        />
                                    </View>
                                </View>
                            )}

                            {tipo === "Decoracao" && (
                                <View>
                                    <View style={styles.field}>
                                        <Text style={styles.label}>Nome da Decoração</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={nomeDecoracao}
                                            onChangeText={setNomeDecoracao}
                                            placeholder="Digite o nome da decoração"
                                            placeholderTextColor="#B0A09A"
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>Categoria</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={categoriaDecoracao}
                                            onChangeText={setCategoriaDecoracao}
                                            placeholder="Ex.: Vintage, Birthday..."
                                            placeholderTextColor="#B0A09A"
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>Observações</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={observacoesDecoracao}
                                            onChangeText={setObservacoesDecoracao}
                                            placeholder="Adicione observações sobre a decoração"
                                            placeholderTextColor="#B0A09A"
                                            multiline
                                            numberOfLines={3}
                                        />
                                    </View>

                                    {adicionais.length > 0 && (
                                        <View style={styles.field}>
                                            <Text style={styles.label}>Adicionais</Text>
                                            <View>
                                                {adicionais.map((adicional) => {
                                                    const selected = adicionaisSelecionados.some((a) => a.id === adicional.id)
                                                    return (
                                                        <Pressable
                                                            key={adicional.id}
                                                            style={styles.checkRow}
                                                            onPress={() => toggleAdicional(adicional)}
                                                        >
                                                            <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
                                                            <Text style={styles.checkLabel}>{adicional.descricao}</Text>
                                                        </Pressable>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {tipo !== "" && (
                        <View style={styles.footer}>
                            <Pressable
                                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <ActivityIndicator color="#000" />
                                    </View>
                                ) : (
                                    <Text style={styles.submitButtonText}>CADASTRAR</Text>
                                )}
                            </Pressable>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddProductModal

AddProductModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
}
