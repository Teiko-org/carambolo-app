import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderKanbanService";

export const useOrders = () => {

  const { data, isLoading, error, isError } = useQuery({

    queryKey: ["orders"],
    queryFn: getOrders,

  });

  return { data, isLoading, error, isError };
};
