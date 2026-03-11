import { ScrollView, View } from "react-native"
import MonthlyOrdersChart from "../molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../organisms/DashOrderContainer/DashOrderContainer"
import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react-native";

const Dashboard = () => {
    const [massaOrders, setMasssaOrders] = useState([{}])
    const [recheiosOrders, setRecheiosOrders] = useState([{}])

    useEffect(async () => {
        await setMasssaOrders([
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
        await setRecheiosOrders([
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
    },[])

    return (
        <ScrollView contentContainerStyle={{ flex:1, gap: 40 }}>

            <DashOrderContainer 
                title="Pedidos Pendentes - Massa"
                cards={massaOrders}
                icon={
                <ClipboardList size={30}/>
            }
            />
            <DashOrderContainer 
                title="Pedidos Pendentes - Recheios"
                cards={recheiosOrders}
                icon={
                <ClipboardList size={30}/>
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
    )
}

export default Dashboard
