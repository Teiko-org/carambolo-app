import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Slot } from 'expo-router';

export default function Layout() {

  return (

    <View style={{ width: "100%", height: "100%" }}>

      <StatusBar style="auto" />

      <Slot>
      </Slot>

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
