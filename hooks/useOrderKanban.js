import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderKanbanService";

export const useOrders = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60, // 1 minute — avoid unnecessary refetches that would overwrite optimistic updates
  });

  return { data, isLoading, error, isError };
};
