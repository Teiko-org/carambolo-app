import { Pressable, View, Text, Image, ScrollView } from "react-native"
import KanbanColumn from "../organisms/KanbanColumn/KanbanColumn"
import ButtonSideMenu from "../atoms/ButtonSideMenu/ButtonSideMenu"
import { useState } from "react"
import SideMenu from "../organisms/SideMenu/SideMenu"

const OrderKanban = () => {

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    // const openSideMenu = () => setIsSideMenuOpen(true);
    // const closeSideMenu = () => setIsSideMenuOpen(false);

    return (
        <View style={{ height: "100%", backgroundColor: "#FFEEE7" }}>
            <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, paddingHorizontal: 20 }}>
                <KanbanColumn title="Cancelados" />
                <KanbanColumn title="Pendentes" />
                <KanbanColumn title="Pagos" />
                <KanbanColumn title="Concluídos" />
            </ScrollView>

            <ButtonSideMenu open={false} />

            {isSideMenuOpen && <SideMenu open={true} />}

        </View>

    )
}

export default OrderKanban