const KANBAN_STATUS_KEYS = new Set(["CANCELADO", "PENDENTE", "PAGO", "CONCLUIDO"]);

export function normalizeKanbanStatus(value) {
  const normalized = String(value ?? "PENDENTE").trim().toUpperCase();
  return KANBAN_STATUS_KEYS.has(normalized) ? normalized : "PENDENTE";
}

const STATUS_LABELS = {
  CANCELADO: "Cancelados",
  PENDENTE: "Pendentes",
  PAGO: "Pagos",
  CONCLUIDO: "Concluídos",
};

/** Transições permitidas no Kanban (espelha o backend). */
export const KANBAN_STATUS_TRANSITIONS = {
  PENDENTE: ["PAGO", "CANCELADO"],
  PAGO: ["CONCLUIDO", "CANCELADO"],
  CANCELADO: ["PENDENTE", "PAGO", "CONCLUIDO"],
  CONCLUIDO: [],
};

export function canPickOrderForKanban(status) {
  return status !== "CONCLUIDO";
}

export function isKanbanStatusTransitionAllowed(fromStatus, toStatus) {
  if (!fromStatus || !toStatus || fromStatus === toStatus) return false;
  if (!canPickOrderForKanban(fromStatus)) return false;
  const allowed = KANBAN_STATUS_TRANSITIONS[fromStatus] ?? [];
  return allowed.includes(toStatus);
}

export function getKanbanTransitionErrorMessage(fromStatus, toStatus) {
  if (!canPickOrderForKanban(fromStatus)) {
    return "Pedidos concluídos não podem ser movidos.";
  }
  if (!isKanbanStatusTransitionAllowed(fromStatus, toStatus)) {
    const fromLabel = STATUS_LABELS[fromStatus] ?? fromStatus;
    const toLabel = STATUS_LABELS[toStatus] ?? toStatus;
    return `Não é possível mover de ${fromLabel} para ${toLabel}.`;
  }
  return null;
}
