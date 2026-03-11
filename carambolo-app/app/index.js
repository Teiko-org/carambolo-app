import { StatusBar, StyleSheet, Text, View } from "react-native";
import Dashboard from "../components/pages/Dashboard";
import DashMostOrderedContainer from "../components/organisms/DashMostOrderedContainer/DashMostOrderedContainer";

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <DashMostOrderedContainer
        title="Produtos mais pedidos"
        filterOptions={[
          {
            title: "all",
          },
          {
            title: "carambolos",
          },
          {
            title: "fornadas",
          },
        ]}
        orders={[
          {
            title: "Bolo de Cenoura c/ cobertura de Chocolate",
            quantity: 99, 
            amount: 99.90
          },
          {
            title: "Bolo de Cenoura c/ cobertura de Chocolate",
            quantity: 99, 
            amount: 99.90
          },
          {
            title: "Bolo de Cenoura c/ cobertura de Chocolate",
            quantity: 99, 
            amount: 99.90
          },
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
