import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFEEE7",
    borderWidth: 2,
    borderColor: "#D4B076",
    borderStyle: "solid",
    borderRadius: 16,
    height: 90,
    width: "100%",
    justifyContent: "space-between",
    padding: 8,
    Color: "#000",
    shadowOffshadowset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
