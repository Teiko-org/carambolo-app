import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  wrapperBot: {
    alignItems: "flex-start",
  },
  botColumn: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  wrapperUser: {
    alignItems: "flex-end",
  },
  bubbleBot: {
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#A47032",
    padding: 14,
    overflow: "hidden",
  },
  bubbleUser: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: "#D4B076",
    padding: 14,
    maxWidth: "85%",
  },
  textBot: {
    color: "#FFEEE7",
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#30344F",
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    width: "100%",
    minHeight: 22,
    paddingLeft: 2,
  },
  timestamp: {
    fontSize: 11,
    color: "#A47032",
  },
  timestampBot: {
    alignSelf: "flex-start",
  },
  timestampBotStandalone: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingLeft: 2,
  },
  timestampUser: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#A47032",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  attachmentsContainer: {
    marginTop: 10,
    gap: 8,
  },
  attachmentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFEEE7",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D4B076",
    alignSelf: "flex-start",
  },
  attachmentText: {
    color: "#103464",
    fontSize: 13,
    fontWeight: "600",
  },
});
