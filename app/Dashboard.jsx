import { ScrollView, View } from "react-native"
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer"
import { ClipboardList } from "lucide-react-native";
import DashMostOrderedContainer from "../components/organisms/DashMostOrderedContainer/DashMostOrderedContainer";
import DashTopCustomersContainer from "../components/organisms/DashTopCustomersContainer/DashTopCustomersContainer";
import DashLastOrdersContainer from "../components/organisms/DashLastOrdersContainer/DashLastOrdersContainer";
import { useMostOrederd, usePendingMassaOrders, usePendingRecheiosOrders } from "../hooks/useDashboard";

// const renderComponentByStatus = (
//     isErrorMassas,
//     errorMassas,
//     isLoadingMassas,
//     massasData
// ) => {

// }

const Dashboard = () => {
    const {
        data: pendingMassaOrders,
        isError: isErrorMassas,
        error: massasError,
        isLoading: isLoadingMassas
    } = usePendingMassaOrders()

    const {
        data: pendingRecheioOrders,
        isError: isErrorRecheios,
        error: recheiosError,
        isLoading: isLoadingRecheios
    } = usePendingRecheiosOrders()

    const {
        data: mostOrderedData,
        isError: isErrorMostOrdered,
        error: mostOrderedError,
        isLoading: isLoadingMostOrdered,
    } = useMostOrederd()

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: "#FFEEE7" }}>
            <ScrollView contentContainerStyle={{ gap: 40, marginBottom: 20 }}>

                <DashOrderContainer
                    title="Pedidos Pendentes - Massa"
                    orders={[
                        {
                            id: 1,
                            title: 'massa123',
                            ordersQuantity: 23,
                            orderStatus: 'PENDENTE'
                        },
                    ]}
                    icon={
                        <ClipboardList size={30} />
                    }
                    isError={isErrorMassas}
                    error={massasError}
                    isLoading={isLoadingMassas}
                />
                <DashOrderContainer
                    title="Pedidos Pendentes - Recheios"
                    orders={pendingRecheioOrders}
                    icon={
                        <ClipboardList size={30} />
                    }
                    isError={isErrorRecheios}
                    error={recheiosError}
                    isLoading={isLoadingRecheios}
                />
                <DashChartContainer
                    headerText="Massas Mais Pedidas Por Mês - 2025"
                    itemOptions={[
                        {
                            label: "Massas",
                            value: "MASSA",
                        },
                        {
                            label: "Recheios",
                            value: "RECHEIO",
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
                >
                    <MonthlyOrdersChart />
                </DashChartContainer>
                <DashMostOrderedContainer
                    title='Produtos mais pedidos'
                    subtitle='Todos os protudos mais pedidos dos seus clientes'
                    orders={[
                        {
                            id: 1,
                            title: 'Pedido dahora',
                            quantity: 23,
                            amount: 25.50
                        },
                        {
                            id: 2,
                            title: 'Pedido dahora',
                            quantity: 23,
                            amount: 25.50
                        },
                        {
                            id: 3,
                            title: 'Pedido dahora',
                            quantity: 23,
                            amount: 25.50
                        },
                        {
                            id: 4,
                            title: 'Pedido dahora',
                            quantity: 23,
                            amount: 25.50
                        },
                    ]}
                />
                <DashTopCustomersContainer
                    title='Principais Clientes'
                    subtitle='Clientes com mais pedidos'
                    customers={[
                        {
                            id: 1,
                            nome: 'Raíne Neres Teixeira Jardim',
                            pedidosTotais: 9999,
                            telefone: '+55 (11) 96809-0282'
                        },
                        {
                            id: 2,
                            nome: 'Raíne Neres Teixeira Jardim',
                            pedidosTotais: 9999,
                            telefone: '+55 (11) 96809-0282'
                        },
                        {
                            id: 3,
                            nome: 'Raíne Neres Teixeira Jardim',
                            pedidosTotais: 9999,
                            telefone: '+55 (11) 96809-0282'
                        },
                        {
                            id: 4,
                            nome: 'Raíne Neres Teixeira Jardim',
                            pedidosTotais: 9999,
                            telefone: '+55 (11) 96809-0282'
                        },
                        {
                            id: 5,
                            nome: 'Raíne Neres Teixeira Jardim',
                            pedidosTotais: 9999,
                            telefone: '+55 (11) 96809-0282'
                        }
                    ]}
                />
                <DashLastOrdersContainer
                    title={'Últimos Pedidos'}
                    subtitle={'Pedidos mais recentes'}
                    orders={[
                        {
                            name: '',
                            phone: '',
                            type: '',

                        }
                    ]}
                />
            </ScrollView>
        </View>
    )
}

export default Dashboard
