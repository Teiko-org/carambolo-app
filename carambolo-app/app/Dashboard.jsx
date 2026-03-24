import { ScrollView, View } from "react-native"
import MonthlyOrdersChart from "../components/molecules/MonthlyOrdersChart/MonthlyOrdersChart"
import DashChartContainer from "../components/organisms/DashChartContainer/DashChartContainer"
import DashOrderContainer from "../components/organisms/DashOrderContainer/DashOrderContainer"
import { ClipboardList } from "lucide-react-native";
import { useMassasPendentes } from "../hooks/useDashboard"

// const renderComponentByStatus = (
//     isErrorMassas,
//     errorMassas,
//     isLoadingMassas,
//     massasData
// ) => {

// }

const Dashboard = () => {
    const {
        data: massasData,
        isError: isErrorMassas,
        error: massasError,
        isLoading: isLoadingMassas
    } = useMassasPendentes()


    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: "#FFEEE7" }}>
            <ScrollView contentContainerStyle={{ gap: 40, marginBottom: 20 }}>

                <DashOrderContainer
                    title="Pedidos Pendentes - Massa"
                    cards={massasData}
                    icon={
                        <ClipboardList size={30} />
                    }
                />
                <DashOrderContainer
                    title="Pedidos Pendentes - Recheios"
                    cards={{}}
                    icon={
                        <ClipboardList size={30} />
                    }
                />
                <DashChartContainer
                    headerText="Massas Mais Pedidas Por Mês - 2025"
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
                > <MonthlyOrdersChart />
                </DashChartContainer>
            </ScrollView>
        </View>

    )
}

export default Dashboard
