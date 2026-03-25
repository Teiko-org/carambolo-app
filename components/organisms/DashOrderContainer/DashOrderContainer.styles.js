import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFE7DD",
    borderColor: "#D4B076",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 16,
    width: "100%",
    padding: 6,
    maxHeight: 300,
    overflow: "hidden",
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
    maxHeight: 220,
    flexGrow: 0,
  },
});

export default styles;
