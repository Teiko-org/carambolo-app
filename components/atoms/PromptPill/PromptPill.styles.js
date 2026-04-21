import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderColor: "#A47032",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    alignSelf: "center",
    height: 40,
    justifyContent: "center",
  },
  pillPressed: {
    backgroundColor: "rgba(164,112,50,0.1)",
  },
  label: {
    color: "#A47032",
    fontSize: 13,
    fontWeight: "500",
  },
});
