import { StatusBar, StyleSheet, Text, View } from "react-native";
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart";
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer";

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <DashChartContainer
        headerText="Massas Mais Pedidas Por Mês - 20251"
        children={<MonthlyOrdersChart />}
        massasOptions={[
          {
            label: "Chocolate",
            value: "chocolate",
          },
          {
            label: "Baunilha",
            value: "baunilha",
          },
          {
            label: "Laranja",
            value: "laranja",
          }
        ]}
        anosOptions={[
          {
            label: "2025",
            value: "2025"
          },
          {
            label: "2024",
            value: "2024"
          },
          {
            label: "2023",
            value: "2023"
          }
        ]}
      />
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
