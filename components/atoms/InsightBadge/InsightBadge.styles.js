import { StyleSheet } from "react-native";

const BADGE_COLORS = {
  alert: { bg: "rgba(255,132,135,0.25)", text: "#D9534F" },
  trend: { bg: "rgba(212,176,118,0.25)", text: "#A47032" },
  opportunity: { bg: "rgba(126,200,164,0.25)", text: "#3A8F6A" },
};

export const getBadgeColors = (type) =>
  BADGE_COLORS[type] || BADGE_COLORS.trend;

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
