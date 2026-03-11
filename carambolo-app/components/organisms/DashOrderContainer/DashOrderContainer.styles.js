import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFE7DD",
    borderColor: "#D4B076",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 16,
    width: "100%",
    height: "30%",
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardsContainer: {
    display: "flex",
    alignItems: "center",
    height: "80%",
  },
});

export default styles;
