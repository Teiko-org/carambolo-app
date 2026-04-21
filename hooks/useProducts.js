import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  getCakeProducts,
  getLatestBatchProducts,
  getProducts,
} from "../services/productService"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR")

const formatWeeklyLabel = (items = []) => {
  const firstItem = items.find((item) => item?.dataInicio && item?.dataFim)

  if (!firstItem) {
    return "Fornada da Semana"
  }

  return `${dateFormatter.format(new Date(firstItem.dataInicio))} - ${dateFormatter.format(new Date(firstItem.dataFim))}`
}

export const useProducts = () => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const [productsResponse, latestBatchProducts, cakeProducts] = await Promise.all([
        getProducts(),
        getLatestBatchProducts(),
        getCakeProducts(),
      ])

      return {
        productsPage: productsResponse,
        latestBatchProducts,
        cakeProducts,
      }
    },
  })

  const normalizedData = useMemo(() => {
    const allProducts = Array.isArray(query.data?.productsPage?.content)
      ? query.data.productsPage.content
      : []

    const latestBatchProducts = Array.isArray(query.data?.latestBatchProducts)
      ? query.data.latestBatchProducts
      : []
    const cakeProducts = Array.isArray(query.data?.cakeProducts)
      ? query.data.cakeProducts
      : []

    const latestBatchByProductId = new Map(
      latestBatchProducts.map((item) => [item?.id, item])
    )

    const fornadaProducts = allProducts
      .filter((item) => item?.ativo ?? item?.isAtivo ?? true)
      .map((item) => {
        const latestBatchItem = latestBatchByProductId.get(item?.id)

        return {
          id: item?.id,
          name: item?.produto ?? "Produto sem nome",
          quantity: Number(latestBatchItem?.quantidade ?? 0),
          price: Number(item?.valor ?? latestBatchItem?.valor ?? 0),
          categoria: item?.categoria ?? "",
          descricao: item?.descricao ?? "",
          type: "fornada",
        }
      })

    const bolosProducts = cakeProducts
      .filter((item) => item?.ativo ?? true)
      .map((item) => ({
        id: item?.boloId,
        name: item?.produto ?? "Bolo sem nome",
        quantity: "-",
        price: Number(item?.precoTotal ?? 0),
        categoria: item?.categoria ?? "",
        descricao: item?.saborRecheio ?? "",
        type: "bolo",
      }))

    const products = [...fornadaProducts, ...bolosProducts]
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))

    const weeklyTotal = latestBatchProducts.reduce((accumulator, item) => {
      const quantity = Number(item?.quantidade ?? 0)
      const value = Number(item?.valor ?? 0)
      return accumulator + (quantity * value)
    }, 0)

    return {
      products,
      weeklyLabel: formatWeeklyLabel(latestBatchProducts),
      weeklyPrice: currencyFormatter.format(weeklyTotal),
    }
  }, [query.data])

  return {
    ...query,
    ...normalizedData,
  }
}
