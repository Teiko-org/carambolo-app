import { Pressable, View, Text, Image, ScrollView, Modal } from "react-native"
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn"
import ButtonSideMenu from "../components/atoms/ButtonSideMenu/ButtonSideMenu"
import { useState } from "react"
import SideMenu from "../components/organisms/SideMenu/SideMenu"
import { KanbanBoard, ColumnModel, CardModel } from '@intechnity/react-native-kanban-board';

const OrderKanban = () => {

    const columns = [
        new ColumnModel("new", "New", 1),
        new ColumnModel("inProgress", "In Progress", 2),
        new ColumnModel("ready", "Ready", 3),
    ];

    const cards = [
        new CardModel(
            "card1",
            "new",
            "1st Card",
            "Example card",
            "test description",
            [
                {
                    text: "Tag1",
                    backgroundColor: "#00FF00",
                    textColor: "#000000"
                }
            ],
            null,
            1
        ),
        // ... add more cards ...
    ];

    const onCardDragEnd = (srcColumn: ColumnModel, destColumn: ColumnModel, item: CardModel, targetIdx: number) => {
        // Handle card drag and drop
    };

    const onCardPress = (item: CardModel) => {
        // Handle card press
    };


    return (
        <View style={{ height: "80%", backgroundColor: "#FFEEE7" }}>
            {/* <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, paddingHorizontal: 20 }}>
                <KanbanColumn title="Pedidos Cancelados" />
                <KanbanColumn title="Pedidos Pendentes" />
                <KanbanColumn title="Pedidos Pagos" />
                <KanbanColumn title="Pedidos Concluídos" />
            </ScrollView> */}

            <KanbanBoard
                columns={columns}
                cards={cards}
                onDragEnd={onCardDragEnd}
                onCardPress={onCardPress}
            />


        </View >

    )
}

export default OrderKanban