import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    maxHeight: 56,
  },
  container: {
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 72,
    alignItems: "center",
  },
  fade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 36,
  },
  fadeLeft: {
    left: 0,
  },
  fadeRight: {
    right: 0,
  },
});
