import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderColor: "#A47032",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 12,
    width: "100%",
    height: 625,
    overflow: "hidden",
    shadowOffshadowset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  containerHeader: {
    backgroundColor: "#103464",
    height: 150,
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A47032",
    width: "70%",
    textShadowColor: "#000",
    textShadowOffset: {
      width: 0,
      height: 0.3,
    },
    textShadowRadius: 1,
  },
  filters: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default styles;
