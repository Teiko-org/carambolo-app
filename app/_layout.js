import { Modal, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import "../services/i18n"; // inicializa i18n antes de qualquer tela
import { Slot, usePathname } from "expo-router";
import { useState } from "react";
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu";
import Select from "../components/atoms/Select/Select";
import SideMenu from "../components/organisms/SideMenu/SideMenu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderFilterContext } from "../contexts/orderFilterContext";

const queryClient = new QueryClient();

const HIDE_CHROME_ROUTES = ["/Assistant", "/"];
const HIDE_SIDEMENU_ROUTES = ["/Assistant"];

export default function Layout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const openSideMenu = () => setIsSideMenuOpen(true);
  const closeSideMenu = () => setIsSideMenuOpen(false);

  const [selected, setSelected] = useState("Dashboard");

  const hideChrome = HIDE_CHROME_ROUTES.includes(pathname);
  const hideSideMenu = HIDE_SIDEMENU_ROUTES.includes(pathname);
  const isOrdersPage = pathname === "/OrderKanban";
  const headerTitle = isOrdersPage ? "Pedidos" : selected;

  const handleYearChange = (value) => {
    const onlyDigits = value.replace(/\D/g, "");
    setYear(onlyDigits.slice(0, 4));
  };

  const clearFilter = () => {
    setMonth("");
    setYear("");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <OrderFilterContext.Provider value={{ month, year, setMonth, setYear, clearFilter }}>
      <View style={{ width: "100%", height: "100%", backgroundColor: "#FFEEE7" }}>
        <StatusBar style="auto" />

        {!hideChrome && (
          <View
            style={{
              backgroundColor: "#103464",
              marginVertical: 20,
              marginHorizontal: 15,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderColor: "#A47032",
              borderWidth: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "#A47032",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {headerTitle}
              </Text>
              {isOrdersPage && (
                <Pressable
                  onPress={() => setIsFilterOpen((prev) => !prev)}
                  style={{
                    borderColor: "#A47032",
                    borderWidth: 1.5,
                    borderRadius: 10,
                    backgroundColor: "#FFEEE7",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ color: "#A47032", fontWeight: "700" }}>Filtrar</Text>
                </Pressable>
              )}
            </View>

            {isOrdersPage && isFilterOpen && (
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "#103464",
                  borderWidth: 2,
                  borderColor: "#A47032",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <Text
                  style={{
                    color: "#A47032",
                    fontWeight: "700",
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Filtrar
                </Text>
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                  <View style={{ width: 130, minWidth: 130, maxWidth: 130, flexShrink: 0 }}>
                    <Select
                      placeholder="Mês"
                      selectedValue={month}
                      setSelectedValue={setMonth}
                      options={Array.from({ length: 12 }, (_, index) => {
                        const value = String(index + 1);
                        return { label: value, value };
                      })}
                    />
                  </View>
                  <TextInput
                    value={year}
                    onChangeText={handleYearChange}
                    placeholder="Ano"
                    placeholderTextColor="#5E5E5E"
                    keyboardType="number-pad"
                    maxLength={4}
                    style={{
                      width: 130,
                      minWidth: 130,
                      maxWidth: 130,
                      flexGrow: 0,
                      flexShrink: 0,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 999,
                      borderColor: "#A47032",
                      borderWidth: 2,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontWeight: "700",
                    }}
                  />
                </View>
                <Pressable onPress={clearFilter} style={{ marginTop: 8 }}>
                  <Text style={{ color: "#FFEEE7", textAlign: "right" }}>
                    Limpar filtro
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        <View style={{ flex: 1, minHeight: 0, width: "100%" }}>
          <Slot />
        </View>

        {!hideSideMenu && (
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
      </OrderFilterContext.Provider>
    </QueryClientProvider>
  );
}
