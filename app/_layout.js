import { Modal, StatusBar, Text, View } from "react-native";
import { Slot, usePathname } from "expo-router";
import { useState } from "react";
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu";
import SideMenu from "../components/organisms/SideMenu/SideMenu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const HIDE_CHROME_ROUTES = ["/Assistant"];

export default function Layout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pathname = usePathname();

  const openSideMenu = () => setIsSideMenuOpen(true);
  const closeSideMenu = () => setIsSideMenuOpen(false);

  const [selected, setSelected] = useState("Dashboard");

  const hideChrome = HIDE_CHROME_ROUTES.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <View
        style={{ width: "100%", height: "100%", backgroundColor: "#FFEEE7" }}
      >
        <StatusBar style="auto" />

        {!hideChrome && (
          <View
            style={{
              backgroundColor: "#103464",
              marginVertical: 20,
              marginHorizontal: 15,
              borderRadius: 20,
              paddingLeft: 20,
              borderColor: "#A47032",
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: "#A47032",
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}
            >
              {selected}
            </Text>
          </View>
        )}

        <Slot />

        {!hideChrome && (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: [{ translateY: -25 }],
              zIndex: 10,
            }}
          >
            <ButtonSideMenu onPress={openSideMenu} />
          </View>
        )}

        <Modal
          visible={isSideMenuOpen}
          animationType="none"
          transparent={true}
          onRequestClose={closeSideMenu}
        >
          <SideMenu
            onClose={closeSideMenu}
            selected={selected}
            setSelected={setSelected}
          />
        </Modal>
      </View>
    </QueryClientProvider>
  );
}
