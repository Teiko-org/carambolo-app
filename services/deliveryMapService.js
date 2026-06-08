import api from "./api/api";

export const getDeliveriesMap = async (dataEntrega) => {
  try {
    const { data } = await api.get("/resumo-pedido/entregas-mapa", {
      params: { dataEntrega },
    });
    return data;
  } catch (e) {
    console.log("error getting deliveries map: ", e);
    throw e;
  }
};
