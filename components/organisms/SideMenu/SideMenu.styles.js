import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        flexDirection: "row",
        position: "relative",
    },
    backdropOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    backdropPressable: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    panelWrap: {
        width: "72%",
        height: "100%",
    },
    container: {
        backgroundColor: "#103464",
        width: "100%",
        height: "100%",
        paddingTop: 18,
        paddingBottom: 24,
        borderRightWidth: 1,
        borderRightColor: "#A47032",
        justifyContent: "space-between",
    },
    header: {},
    greetingRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(164,112,50,0.35)",
    },
    userIcon: {
        width: 28,
        height: 28,
        marginRight: 14,
        tintColor: "#D8B06A",
    },
    greetingText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "500",
        letterSpacing: 0.2,
    },
    menuList: {
        paddingTop: 8,
    },
 assistantBlock: {
    borderTopWidth: 1,
    borderTopColor: "rgba(164,112,50,0.35)",
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: -200,                   
},
    assistantDescription: {
        color: "rgba(255,255,255,0.82)",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 16,
        width: "100%",
    },
    assistantRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
    },
 assistantButtonWrap: {
    width: 130,                        // ← mais estreito (era 140)
    marginBottom: 16,
},
   assistantIcon: {
    width: 108,
    height: 108,
    marginBottom: -4,
},
    closeButtonWrap: {
        position: "absolute",
        right: -20,
        top: "50%",
        transform: [{ translateY: -30 }],
        alignItems: "center",
        zIndex: 10,
    },
});

export default styles;