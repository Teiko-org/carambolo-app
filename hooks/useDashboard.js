import { useQuery } from "@tanstack/react-query";
import {
  getMostOrdered,
  getPendingMassaOrders,
  getPendingRecheioOrders,
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

export const useMostOrederd = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["most-ordered"],
    queryFn: getMostOrdered,
  })
  return { data, isLoading, isError, error }
}
