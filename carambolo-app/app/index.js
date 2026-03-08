import { StyleSheet, Text, View } from "react-native";
import Button from "../components/atoms/Button/Button";

export default function Page() {
  return (
    <View style={styles.container}>
      <Button title="Ver pedidos" variant="secondary"></Button>
    </View>
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
