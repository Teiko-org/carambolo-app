import { useQuery } from "@tanstack/react-query";
import {
  getBolosMaisPedidos,
  getLastOrders,
  getMostOrdered,
  getPendingMassaOrders,
  getPendingRecheioOrders,
  getProdutosFornadasMaisPedidos,
} from "../services/dashboardService";

const defaultQueryOptions = {
  retry: 1,
  refetchOnReconnect: false,
};

export const usePendingMassaOrders = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["pending-massa-orders"],
    queryFn: getPendingMassaOrders,
    ...defaultQueryOptions,
  });
  return { data, isLoading, error, isError };
};

export const usePendingRecheiosOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pending-recheio-orders"],
    queryFn: getPendingRecheioOrders,
    ...defaultQueryOptions,
  });
  return { data, isLoading, isError, error };
};

export const useMostOrederd = ({ tipoItem, periodo, ano, mes } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["most-ordered", tipoItem, periodo, ano, mes],
    queryFn: () => getMostOrdered({ tipoItem, periodo, ano, mes }),
    enabled: Boolean(tipoItem),
    ...defaultQueryOptions,
  })
  return { data, isLoading, isError, error }
}

export const useBolosMaisPedidos = ({ enabled = true } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bolos-mais-pedidos"],
    queryFn: getBolosMaisPedidos,
    enabled,
    ...defaultQueryOptions,
  });

  return { data, isLoading, isError, error };
};

export const useProdutosFornadasMaisPedidos = ({ enabled = true } = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["produtos-fornadas-mais-pedidos"],
    queryFn: getProdutosFornadasMaisPedidos,
    enabled,
    ...defaultQueryOptions,
  });

  return { data, isLoading, isError, error };
};

export const useLastOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["last-orders"],
    queryFn: getLastOrders,
    ...defaultQueryOptions,
  });

  return { data, isLoading, isError, error };
};
