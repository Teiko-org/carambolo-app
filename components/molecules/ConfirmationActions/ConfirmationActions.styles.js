import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(16, 52, 100, 0.12)",
  },
  previewText: {
    fontSize: 13,
    color: "#103464",
    marginBottom: 10,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  btnConfirm: {
    backgroundColor: "#103464",
  },
  btnCancelText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 14,
  },
  btnConfirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
