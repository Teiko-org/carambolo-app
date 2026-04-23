import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "#A47032",
    borderWidth: 2,
    borderColor: "#D4B076",
    borderStyle: "solid",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  default: {
    backgroundColor: "#FBEAE3",
    borderWidth: 2,
    borderColor: "#D4B076",
    borderStyle: "solid",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
