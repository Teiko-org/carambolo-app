import { StyleSheet, Text, View } from "react-native";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn";
import SideMenu from "../components/organisms/SideMenu/SideMenu";
import OrderKanban from "../components/pages/OrderKanban";


export default function Page() {
  return (

    <OrderKanban/>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
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
