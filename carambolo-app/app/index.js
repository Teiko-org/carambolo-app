import { StatusBar, StyleSheet, Text, View } from "react-native";
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart";
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer";
import { StyleSheet, Text, View } from "react-native";
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer";
import MonthlyOrdersChart from "../components/organisms/MonthlyOrdersChart/MonthlyOrdersChart";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn";
import SideMenu from "../components/organisms/SideMenu/SideMenu";
import OrderKanban from "../components/pages/OrderKanban";
import OrderSummary from "../components/organisms/OrderSummary/OrderSummary";


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
