import { useQuery } from "@tanstack/react-query"
import { getMassasPendentes } from "../services/dashboardService"

export const useMassasPendentes = () => {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["massas-pendentes"],
        queryFn: getMassasPendentes,
    })
    return { data, isLoading, error, isError }
}