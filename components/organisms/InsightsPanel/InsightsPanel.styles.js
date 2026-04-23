import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    maxHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#A47032",
    textAlign: "center",
    flex: 1,
  },
  toggleBtn: {
    padding: 4,
  },
  loading: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: "#A47032",
    marginTop: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#A47032",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A47032",
  },
  retryText: {
    fontSize: 12,
    color: "#A47032",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 8,
  },
});
