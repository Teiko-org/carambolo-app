import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    header: {
        backgroundColor: "#103464",
        width: "100%",
        paddingVertical: 16,

        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A47032",

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        gap: 10,
    },

    closeHandle: {
        backgroundColor: "#A47032",
        width: 100,
        height: 5,
        borderRadius: 25,
    },

    closeHandleGesture: {
        height: 8,
        width: 120,
    },

    closeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E0C9A6",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
    },

    closeBtnText: {
        color: "#FFEEE7",
        fontSize: 14,
        fontWeight: "700",
    },

    gestureSheetHint: {
        color: "rgba(255, 238, 231, 0.75)",
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
    },

    headerTitle: {
        color: "#A47032",
        fontSize: 20,
        fontWeight: "bold",


    },

    headerText: {

        color: "white",
        fontSize: 15,


    },

    body: {

        backgroundColor: "#FFEEE7",
        width: "100%",
        flex: 1,
        minHeight: 0,
    },

    title: {

        color: "#103464",
        fontSize: 20,
        fontWeight: "bold",

        paddingTop: 10,
        paddingBottom: 15,

    },

    subtitle: {
        color: "#103464",
        fontSize: 16,
        fontWeight: "bold",

        paddingTop: 20,
        paddingBottom: 10,
    },

    label: {

        color: "#103464",
        fontWeight: "bold",
        fontSize: 15,
    },

    data: {

        color: "black",
        fontWeight: "normal",
        fontSize: 15,

    },

    gestureCloseRail: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "20%",
        zIndex: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    gestureCloseRailText: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },

    sheetSurface: {
        width: "100%",
        flex: 1,
        minHeight: 0,
    },

    scrollContent: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
})

export default styles;