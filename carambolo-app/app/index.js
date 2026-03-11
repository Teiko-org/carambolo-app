import { StatusBar, StyleSheet, Text, View } from "react-native";
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart";
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer";
import Dashboard from "../components/pages/Dashboard";

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#FFEEE7",
    // overflow: "hidden",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
