import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  btn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnActive: {
    backgroundColor: "rgba(164, 112, 50, 0.14)",
  },
  copiedLabel: {
    fontSize: 11,
    color: "#6B8F71",
    marginLeft: 2,
    fontWeight: "500",
  },
});
