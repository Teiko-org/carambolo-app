import { useQuery } from "@tanstack/react-query";
import {
  getPendingMassaOrders,
  getPendingRecheioOrders,
} from "../services/dashboardService";

export const usePendingMassaOrders = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["pending-massa-orders"],
    queryFn: getPendingMassaOrders,
  });
  return { data, isLoading, error, isError };
};

// export const usePendingRecheiosOrders = () => {
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["pending-recheio-orders"],
//     queryFn: getPendingRecheioOrders,
//   });
//   return { data, isLoading, isError, error };
// };
