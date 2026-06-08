import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFEEE7",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#A47032",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#103464",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerTitle: {
    color: "#C79D53",
    fontSize: 17,
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 10,
  },
  lead: {
    color: "#4a2f14",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  detail: {
    color: "#6b3f1a",
    fontSize: 14,
    lineHeight: 21,
  },
  hint: {
    color: "#A47032",
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 4,
  },
  secondaryAction: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  secondaryActionText: {
    color: "#103464",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  primaryAction: {
    flexShrink: 0,
  },
});

export default styles;
