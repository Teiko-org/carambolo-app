import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    borderWidth: 2,
    borderColor: "#A47032",
    borderStyle: "solid",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContainer: {
    backgroundColor: "#103464",
    padding: 15,
    gap: 10,
  },
  headerTitle: {
    color: "#A47032",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: {
      width: 0,
      height: 0.3,
    },
    textShadowRadius: 1,
  },
  filtersContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardsContainer: {
    padding: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    width: "60%",
  },
});

export default styles;
