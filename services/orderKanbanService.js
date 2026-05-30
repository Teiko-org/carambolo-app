import api from "./api/api";

/** Lista completa do Kanban — resposta grande (~15s+ com seed histórico). */
const KANBAN_ORDERS_TIMEOUT_MS = 120_000;

export const getOrders = async () => {
  console.log("Buscando pedidos do back-end");
  const { data } = await api.get("/bolos/pedido/completo", {
    timeout: KANBAN_ORDERS_TIMEOUT_MS,
  });
  if (!Array.isArray(data)) {
    console.warn("[Kanban] Resposta inesperada de /bolos/pedido/completo:", data);
    return [];
  }
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