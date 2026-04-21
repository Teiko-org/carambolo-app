import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A47032",
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 12,
    shadowColor: "rgba(164,112,50,0.15)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#30344F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0C9A6",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#A47032",
    marginTop: 6,
    marginBottom: 8,
  },
});
