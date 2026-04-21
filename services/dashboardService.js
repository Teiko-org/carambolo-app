import api from "./api/api"

export const getPendingMassaOrders = async () => {
  try {
    const { data } = await api.get("/dashboard/massas-pendentes");
    return data
  } catch(e) {
    console.log("error getting massas pendentes: ", e)
  }
  
};

export const getPendingRecheioOrders = async () => {
  try {
    const { data } = await api.get("/dashboard/recheios-pendentes");
    return data
  } catch(e) {
    console.log("error getting recheios pendentes: ", e)
  }
  
};

export const getMostOrdered = async ({ tipoItem, periodo, ano, mes } = {}) => {
  try {
    const params = {
      tipoItem,
      periodo,
      ano,
      mes,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );

    const { data } = await api.get("/dashboard/itens-mais-pedidos-por-periodo", {
      params: filteredParams,
    });
    return data
  } catch(e) {
    console.log("error getting most ordered: ", e)
  }
}

export const getBolosMaisPedidos = async () => {
  try {
    const { data } = await api.get("/dashboard/bolosMaisPedidos");
    return data;
  } catch (e) {
    console.log("error getting bolos mais pedidos: ", e);
  }
};

export const getProdutosFornadasMaisPedidos = async () => {
  try {
    const { data } = await api.get("/dashboard/produtosFornadasMaisPedidos");
    return data;
  } catch (e) {
    console.log("error getting produtos fornadas mais pedidos: ", e);
  }
};
