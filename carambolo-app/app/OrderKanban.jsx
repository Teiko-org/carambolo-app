import { Pressable, View, Text, Image, ScrollView, Modal } from "react-native"
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn"
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu"
import { useState } from "react"
import SideMenu from "../components/organisms/SideMenu/SideMenu"

const OrderKanban = () => {

    return (
        <View style={{ height: "80%", backgroundColor: "#FFEEE7" }}>
            <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, paddingHorizontal: 20 }}>
                <KanbanColumn title="Pedidos Cancelados" />
                <KanbanColumn title="Pedidos Pendentes" />
                <KanbanColumn title="Pedidos Pagos" />
                <KanbanColumn title="Pedidos Concluídos" />
            </ScrollView>

        </View >

    )
}

export default OrderKanban