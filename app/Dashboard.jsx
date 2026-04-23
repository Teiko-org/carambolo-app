import { ScrollView, View } from "react-native"
import { useMemo, useState } from "react"
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer"
import { ClipboardList } from "lucide-react-native";
import DashMostOrderedContainer from "../components/organisms/DashMostOrderedContainer/DashMostOrderedContainer";
import DashTopCustomersContainer from "../components/organisms/DashTopCustomersContainer/DashTopCustomersContainer";
import DashLastOrdersContainer from "../components/organisms/DashLastOrdersContainer/DashLastOrdersContainer";
import { useMostOrederd, usePendingMassaOrders, usePendingRecheiosOrders } from "../hooks/useDashboard";

const Dashboard = () => {
    const [selectedTipoItem, setSelectedTipoItem] = useState("MASSA")
    const [selectedAno, setSelectedAno] = useState("2025")

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
        isLoading: isLoadingMostOrdered,
    } = useMostOrederd({
        tipoItem: selectedTipoItem,
        periodo: "MES",
        ano: Number(selectedAno),
    })

    const chartData = useMemo(() => {
        if (!Array.isArray(mostOrderedData)) {
            return []
        }

        const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        const aggregatedByMonth = new Map()

        mostOrderedData.forEach((item) => {
            const period = item?.periodo
            if (typeof period !== "string" || !period.includes("-")) {
                return
            }

            const [, monthString] = period.split("-")
            const monthIndex = Number(monthString) - 1
            if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
                return
            }

            const monthLabel = monthLabels[monthIndex]
            const quantity = Number(item?.quantidade || 0)
            const currentData = aggregatedByMonth.get(monthLabel)

            if (!currentData || quantity > currentData.value) {
                aggregatedByMonth.set(monthLabel, {
                    value: quantity,
                    label: monthLabel,
                    nomeItem: item?.nomeItem || "",
                })
            }
        })

        return Array.from(aggregatedByMonth.values())
            .sort((a, b) => monthLabels.indexOf(a.label) - monthLabels.indexOf(b.label))
            .map((item, index) => ({
                value: item.value,
                label: item.label,
                nomeItem: item.nomeItem,
                frontColor: index % 2 === 0 ? "#103464" : "#A47032",
            }))
    }, [mostOrderedData])

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: "#FFEEE7" }}>
            <ScrollView contentContainerStyle={{ gap: 40, marginBottom: 20 }}>

                <DashOrderContainer
                    title="Pedidos Pendentes - Massa"
                    orders={pendingMassaOrders}
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
                    headerText={`${selectedTipoItem === "MASSA" ? "Massas" : "Recheios"} Mais Pedidos Por Mês - ${selectedAno}`}
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
                    selectedTipoItem={selectedTipoItem}
                    setSelectedTipoItem={setSelectedTipoItem}
                    selectedAno={selectedAno}
                    setSelectedAno={setSelectedAno}
                >
                    <MonthlyOrdersChart
                        data={chartData}
                        isLoading={isLoadingMostOrdered}
                        isError={isErrorMostOrdered}
                    />
                </DashChartContainer>
                <DashMostOrderedContainer
                    title='Produtos mais pedidos'
                    subtitle='Todos os protudos mais pedidos dos seus clientes'
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
