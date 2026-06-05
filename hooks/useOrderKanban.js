import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderKanbanService";

export const useOrders = ({ month, year } = {}) => {
  const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
    queryKey: ["orders", month || null, year || null],
    queryFn: () => getOrders({ month, year }),
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error, isError, refetch, isFetching };
};
