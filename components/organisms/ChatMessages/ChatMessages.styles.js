import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingVertical: 8,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageWrap: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A47032",
    marginHorizontal: 2,
  },
  typingText: {
    color: "#A47032",
    fontSize: 12,
    marginLeft: 8,
  },
});
