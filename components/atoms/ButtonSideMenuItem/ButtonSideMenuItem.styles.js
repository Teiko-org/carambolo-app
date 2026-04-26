import { StyleSheet } from "react-native";

const styles = (selected = false, exit = false, compact = false, isAssistantCta = false) =>
    StyleSheet.create({
        button: {
   minHeight: isAssistantCta ? 42 : compact ? 65 : 65,
    marginVertical: 0,
    paddingHorizontal: isAssistantCta ? 12 : 20,
    paddingVertical: isAssistantCta ? 10 : 0,
    marginBottom: isAssistantCta ? 24 : 0,   // ← mais espaço acima do robô
    backgroundColor: isAssistantCta
        ? "#FFEEE7F2"
        : selected
        ? "rgba(255,255,255,0.07)"
        : "transparent",
    borderRadius: isAssistantCta ? 12 : 0,   // ← menos arredondado = mais quadrado
    borderWidth: isAssistantCta ? 1.5 : 0,
    borderColor: isAssistantCta ? "#BF9328" : "transparent",
    borderLeftWidth: isAssistantCta ? 1.5 : selected ? 4 : 0,
    borderLeftColor: isAssistantCta ? "#BF9328" : "#D7B15B",
    alignItems: isAssistantCta ? "center" : "flex-start",
    justifyContent: "center",
},
text: {
    color: isAssistantCta ? "#BF9328" : exit ? "#FFFFFF" : "#FFFFFF",
    fontSize: isAssistantCta ? 11 : 18,      // ← texto menor
    fontWeight: isAssistantCta ? "600" : selected ? "700" : "300",
    lineHeight: isAssistantCta ? 15 : 24,
    textAlign: isAssistantCta ? "center" : "left",
},
    });

export default styles;