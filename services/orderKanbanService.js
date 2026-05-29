import api from "./api/api";

export const getOrders = async ({ month, year } = {}) => {
  console.log("Buscando pedidos do back-end");
  const params = {};

  if (year?.length === 4) {
    params.ano = Number(year);
  }

  if (month?.length > 0) {
    const monthNumber = Number(month);
    if (monthNumber >= 1 && monthNumber <= 12) {
      params.mes = monthNumber;
    }
  }

  const { data } = await api.get("/bolos/pedido/completo", { params });
  console.log(data);
  return data;
};

export const setOrderStatusCancelado = async (id) => {
  console.log(`Setting order ${id} status to canceled`);
  const { data } = await api.patch(`/resumo-pedido/${id}/cancelado`);
  return data;
};

export const setOrderStatusPendente = async (id) => {
  console.log(`Setting order ${id} status to pending`);
  const { data } = await api.patch(`/resumo-pedido/${id}/pendente`);
  return data;
};

export const setOrderStatusPago = async (id) => {
  console.log(`Setting order ${id} status to paid`);
  const { data } = await api.patch(`/resumo-pedido/${id}/pago`);
  return data;
};

export const setOrderStatusConcluido = async (id) => {
  console.log(`Setting order ${id} status to completed`);
  const { data } = await api.patch(`/resumo-pedido/${id}/concluido`);
  return data;
};

const statusApiMap = {
  CANCELADO: setOrderStatusCancelado,
  PENDENTE: setOrderStatusPendente,
  PAGO: setOrderStatusPago,
  CONCLUIDO: setOrderStatusConcluido,
};

export const updateOrderStatus = async (id, status) => {
  const updateFn = statusApiMap[status];

  if (!updateFn) {
    throw new Error(`Status inválido para atualização: ${status}`);
  }

  return updateFn(id);
};