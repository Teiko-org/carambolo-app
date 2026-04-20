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

export const getMostOrdered = async () => {
  try {
    const { data } = await api.get("/dashboard/itens-mais-pedidos-por-periodo")
    return data
  } catch(e) {
    console.log("error getting most ordered: ", e)
  }
}
