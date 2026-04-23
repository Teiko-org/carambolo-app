import { useQuery } from "@tanstack/react-query";
import {
  getBolosMaisPedidos,
  getMostOrdered,
  getPendingMassaOrders,
  getPendingRecheioOrders,
  getProdutosFornadasMaisPedidos,
} from "../services/dashboardService";

export const usePendingMassaOrders = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["pending-massa-orders"],
    queryFn: () => {
      console.log("queryFn called"); // does this log?
      return getPendingMassaOrders();
    },
  });
  return { data, isLoading, error, isError };
};

export const usePendingRecheiosOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pending-recheio-orders"],
    queryFn: getPendingRecheioOrders,
  });
  return { data, isLoading, isError, error };
};

export const useMostOrederd = ({ tipoItem, periodo, ano, mes } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["most-ordered", tipoItem, periodo, ano, mes],
    queryFn: () => getMostOrdered({ tipoItem, periodo, ano, mes }),
    enabled: Boolean(tipoItem),
  })
  return { data, isLoading, isError, error }
}

export const useBolosMaisPedidos = ({ enabled = true } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bolos-mais-pedidos"],
    queryFn: getBolosMaisPedidos,
    enabled,
  });

  return { data, isLoading, isError, error };
};

export const useProdutosFornadasMaisPedidos = ({ enabled = true } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["produtos-fornadas-mais-pedidos"],
    queryFn: getProdutosFornadasMaisPedidos,
    enabled,
  });

  return { data, isLoading, isError, error };
};
