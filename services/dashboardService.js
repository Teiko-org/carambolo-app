import api from "./api/api";

export const getPendingMassaOrders = async () => {
  console.log("geting massa");
  const { data } = await api.get("/dashboard/massas-pendentes");
  return data;
};

export const getPendingRecheioOrders = async () => {
  console.log("geting recheio");
  const { data } = await api.get("/dashboard/recheios-pendentes");
  return data;
};
