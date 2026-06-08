import { createContext, useContext } from "react";

export const OrderFilterContext = createContext({
  month: "",
  year: "",
  setMonth: () => {},
  setYear: () => {},
  clearFilter: () => {},
});

export const useOrderFilter = () => useContext(OrderFilterContext);
