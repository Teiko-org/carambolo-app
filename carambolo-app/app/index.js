import { StyleSheet, Text, View } from "react-native";
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer";
import { ClipboardList } from "lucide-react-native";
import MonthlyOrdersChart from "../components/organisms/MonthlyOrdersChart/MonthlyOrdersChart";

export default function Page() {

  return (
    <View style={styles.container}>
      <MonthlyOrdersChart />
    </View>
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
