import { ScrollView, View } from "react-native"
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer"
import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react-native";

const Dashboard = () => {
    const [massaOrders, setMasssaOrders] = useState([{}])
    const [recheiosOrders, setRecheiosOrders] = useState([{}])

    useEffect(() => {
        // populate orders; no need for async since we aren't awaiting real async work
        setMasssaOrders([
            {
                title: "Cacau Expresso",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Amarula",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Laranja",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Mármore",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            }
        ])
        setRecheiosOrders([
            {
                title: "Brigadeiro",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Doce de Leite",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Guaraná",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            },
            {
                title: "Baunilha",
                ordersQuantity: 99,
                ordersStatus: "PENDENTE"
            }
        ])
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ gap: 40, marginBottom: 20 }}>

                <DashOrderContainer
                    title="Pedidos Pendentes - Massa"
                    cards={massaOrders}
                    icon={
                        <ClipboardList size={30} />
                    }
                />
                <DashOrderContainer
                    title="Pedidos Pendentes - Recheios"
                    cards={recheiosOrders}
                    icon={
                        <ClipboardList size={30} />
                    }
                />
                <DashChartContainer
                    headerText="Massas Mais Pedidas Por Mês - 2025"
                    children={<MonthlyOrdersChart />}
                    massasOptions={[
                        {
                            label: "Chocolate",
                            value: "chocolate",
                        },
                        {
                            label: "Baunilha",
                            value: "baunilha",
                        },
                        {
                            label: "Laranja",
                            value: "laranja",
                        }
                    ]}
                    anosOptions={[
                        {
                            label: "2025",
                            value: "2025"
                        },
                        {
                            label: "2024",
                            value: "2024"
                        },
                        {
                            label: "2023",
                            value: "2023"
                        }
                    ]}
                />
            </ScrollView>
        </View>

    )
}

export default Dashboard
