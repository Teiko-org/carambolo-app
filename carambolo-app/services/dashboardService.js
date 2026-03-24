import api from "./api/api"

export const getMassasPendentes = async () => {
    const { data } = await api.get("/dashboard/massas-pendentes")
    return data
}
