import { Pressable, View, Text, Image, ScrollView, Modal } from "react-native"
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn"
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu"
import { useState } from "react"
import SideMenu from "../components/organisms/SideMenu/SideMenu"

const OrderKanban = () => {

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const openSideMenu = () => setIsSideMenuOpen(true);
    const closeSideMenu = () => setIsSideMenuOpen(false);

    return (
        <View style={{ height: "100%", backgroundColor: "#FFEEE7" }}>
            <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, paddingHorizontal: 20 }}>
                <KanbanColumn title="Pedidos Cancelados" />
                <KanbanColumn title="Pedidos Pendentes" />
                <KanbanColumn title="Pedidos Pagos" />
                <KanbanColumn title="Pedidos Concluídos" />
            </ScrollView>

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
                <SideMenu onClose={closeSideMenu} />
            </Modal>

        </View >

    )
}

export default OrderKanban