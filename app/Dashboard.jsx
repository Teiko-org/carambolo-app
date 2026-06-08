import { ScrollView, View } from "react-native"
import { useMemo, useState } from "react"
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer"
import { ClipboardList } from "lucide-react-native";
import DashMostOrderedContainer from "../components/organisms/DashMostOrderedContainer/DashMostOrderedContainer";
/* import DashTopCustomersContainer from "../components/organisms/DashTopCustomersContainer/DashTopCustomersContainer"; */
import DashLastOrdersContainer from "../components/organisms/DashLastOrdersContainer/DashLastOrdersContainer";
import {
    useLastOrders,
    useMostOrederd,
    usePendingMassaOrders,
    usePendingRecheiosOrders,
} from "../hooks/useDashboard";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const orderTypeLabelMap = {
    RETIRADA: "Retirada",
    ENTREGA: "Entrega",
}

const formatPhone = (phone) => {
    const digits = String(phone ?? "").replace(/\D/g, "")

    if (digits.length === 13) {
        const countryCode = digits.slice(0, 2)
        const areaCode = digits.slice(2, 4)
        const firstPart = digits.slice(4, 9)
        const secondPart = digits.slice(9, 13)
        return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`
    }

    if (digits.length === 11) {
        const areaCode = digits.slice(0, 2)
        const firstPart = digits.slice(2, 7)
        const secondPart = digits.slice(7, 11)
        return `(${areaCode}) ${firstPart}-${secondPart}`
    }

    return String(phone ?? "")
}

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

    const {
        data: lastOrdersData,
        isLoading: isLoadingLastOrders,
        isError: isErrorLastOrders,
        error: lastOrdersError,
    } = useLastOrders()

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

        const normalizeLabel = (name) =>
            name
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())

        return Array.from(aggregatedByMonth.values())
            .sort((a, b) => monthLabels.indexOf(a.label) - monthLabels.indexOf(b.label))
            .map((item, index) => ({
                value: item.value,
                label: item.label,
                nomeItem: normalizeLabel(item.nomeItem),
                frontColor: index % 2 === 0 ? "#103464" : "#A47032",
            }))
    }, [mostOrderedData])

    const formattedLastOrders = useMemo(() => {
        if (!Array.isArray(lastOrdersData)) {
            return []
        }

        return lastOrdersData.slice(0, 15).map((order) => ({
            id: order?.id ?? `${order?.dataPedido}-${order?.nomeDoCliente}`,
            resumoId: order?.id,
            pedidoBoloId: order?.pedidoBoloId ?? null,
            pedidoFornadaId: order?.pedidoFornadaId ?? null,
            tipoProduto: order?.tipoProduto ?? "BOLO",
            name: order?.nomeDoCliente || "Cliente sem nome",
            phone: formatPhone(order?.telefoneDoCliente),
            type: orderTypeLabelMap[order?.tipoDoPedido] || order?.tipoDoPedido || "N/A",
            price: currencyFormatter.format(Number(order?.valorPedido || 0)),
        }))
    }, [lastOrdersData])

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
                {/* 
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
                */}
                <DashLastOrdersContainer
                    title={'Últimos Pedidos'}
                    subtitle={'Pedidos mais recentes'}
                    orders={formattedLastOrders}
                    isLoading={isLoadingLastOrders}
                    isError={isErrorLastOrders}
                    error={lastOrdersError}
                />
            </ScrollView>
        </View>
    )
}

export default Dashboard
