import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingVertical: 8,
    position: "relative",
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
  jumpToBottomBtn: {
    position: "absolute",
    right: 12,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A47032",
    shadowColor: "#4a2f14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  jumpToBottomPressable: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
