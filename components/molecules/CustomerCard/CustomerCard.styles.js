import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    borderColor: "#A47032",
    borderWidth: 2,
    borderStyle: "solid",
    height: 120,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 12,
  },
  imageContainer: {
    justifyContent: "center",
  },
  infoContainer: {
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  ordersQuantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
