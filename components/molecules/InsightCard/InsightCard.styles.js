import { StyleSheet } from "react-native";

const CARD_COLORS = {
  alert: {
    bg: "rgba(255,132,135,0.12)",
    border: "rgba(255,132,135,0.55)",
  },
  trend: {
    bg: "rgba(212,176,118,0.12)",
    border: "rgba(212,176,118,0.55)",
  },
  opportunity: {
    bg: "rgba(126,200,164,0.12)",
    border: "rgba(126,200,164,0.55)",
  },
};

export const getCardColors = (type) =>
  CARD_COLORS[type] || CARD_COLORS.trend;

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dismissBtn: {
    padding: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#30344F",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: "#444",
  },
});
