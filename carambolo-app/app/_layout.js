import { Modal, StatusBar, StyleSheet, Text, View } from "react-native";
import { Slot } from 'expo-router';
import { useState } from "react";
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu";
import SideMenu from "../components/organisms/SideMenu/SideMenu";

export default function Layout() {

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const openSideMenu = () => setIsSideMenuOpen(true);
  const closeSideMenu = () => setIsSideMenuOpen(false);

  const [selected, setSelected] = useState("Dashboard");

  return (

    <View style={{ width: "100%", height: "100%", backgroundColor: "#FFEEE7" }}>

      <StatusBar style="auto" />

      <View style={{backgroundColor: "#103464", marginVertical: 20, marginHorizontal: 15, borderRadius: 20, paddingLeft: 20, borderColor: "#A47032", borderWidth: 2 }}>
        <Text style={{color: "#A47032", fontSize: 20, fontWeight: "bold", padding: 10}}>
          {selected}
        </Text>
      </View>

      <Slot>
      </Slot>

      <View
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: [{ translateY: -25 }],
          zIndex: 10
        }}
      >

        <ButtonSideMenu onPress={openSideMenu} />

      </View>

      <Modal
        visible={isSideMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeSideMenu}
      >
        <SideMenu 
        onClose={closeSideMenu} 
        selected={selected} 
        setSelected={setSelected}/>

      </Modal>

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
