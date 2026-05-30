import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#30344F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A47032",
    borderRadius: 20,
    marginHorizontal: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A47032",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D4B076",
    borderWidth: 2,
    borderColor: "#30344F",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#D4B076",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(212,176,118,0.7)",
    fontSize: 12,
    marginTop: 1,
  },
});
