import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderKanbanService";

export const useOrders = () => {
  const { data, isLoading, error, isError, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error, isError, refetch, isFetching };
};
