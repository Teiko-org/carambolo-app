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

    <OrderSummary />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
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
