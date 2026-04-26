import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    container: {
        width: "100%",
        maxHeight: "85%",
        backgroundColor: "#FFE7DD",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#A47032",
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#103464",
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    headerTitle: {
        color: "#C79D53",
        fontSize: 16,
        fontWeight: "600",
    },
    tipoRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#A47032",
    },
    tipoButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: "#A47032",
        alignItems: "center",
    },
    tipoButtonActive: {
        backgroundColor: "#C79D53",
    },
    tipoButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#A47032",
    },
    tipoButtonTextActive: {
        color: "#000000",
    },
    scrollArea: {
        flexGrow: 0,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 14,
    },
    field: {
        gap: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#103464",
    },
    input: {
        backgroundColor: "#FFF8F5",
        borderWidth: 1,
        borderColor: "#C79D53",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 9,
        fontSize: 13,
        color: "#161616",
    },
    textArea: {
        minHeight: 72,
        textAlignVertical: "top",
    },
    checkRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 6,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "#A47032",
        backgroundColor: "#FFF8F5",
    },
    checkboxSelected: {
        backgroundColor: "#C79D53",
        borderColor: "#A47032",
    },
    checkLabel: {
        fontSize: 13,
        color: "#161616",
    },
    imagePicker: {
        borderWidth: 1.5,
        borderColor: "#C79D53",
        borderStyle: "dashed",
        borderRadius: 8,
        height: 120,
        overflow: "hidden",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FFF8F5",
    },
    imagePlaceholderText: {
        fontSize: 13,
        color: "#A47032",
        fontWeight: "500",
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: "#A47032",
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#C79D53",
        borderWidth: 2,
        borderColor: "#A47032",
        borderRadius: 999,
        paddingHorizontal: 32,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
    },
})

export default styles
