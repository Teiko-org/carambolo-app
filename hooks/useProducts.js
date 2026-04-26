import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCakeProducts,
  getLatestBatchProducts,
  getProducts,
  updateBoloStatus,
  updateFornadaStatus,
} from "../services/productService"

export const useProducts = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const [productsResponse, latestBatchProducts, cakeProducts] = await Promise.all([
        getProducts(),
        getLatestBatchProducts(),
        getCakeProducts(),
      ])
      return { productsPage: productsResponse, latestBatchProducts, cakeProducts }
    },
  })

  const toggleStatus = useMutation({
    mutationFn: async ({ id, type, isAtivo }) => {
      if (type === "bolo") {
        await updateBoloStatus(id, isAtivo)
      } else {
        await updateFornadaStatus(id, isAtivo)
      }
    },
    onMutate: async ({ id, type, isAtivo }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] })

      const previous = queryClient.getQueryData(["products"])

      queryClient.setQueryData(["products"], (old) => {
        if (!old) return old

        if (type === "bolo") {
          return {
            ...old,
            cakeProducts: old.cakeProducts.map((item) =>
              item?.boloId === id ? { ...item, ativo: isAtivo } : item
            ),
          }
        } else {
          return {
            ...old,
            productsPage: {
              ...old.productsPage,
              content: old.productsPage.content.map((item) =>
                item?.id === id ? { ...item, ativo: isAtivo } : item
              ),
            },
          }
        }
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products"], context.previous)
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

    const fornadaProducts = allProducts.map((item) => {
      const latestBatchItem = latestBatchByProductId.get(item?.id)
      return {
        id: item?.id,
        name: item?.produto ?? "Produto sem nome",
        quantity: Number(latestBatchItem?.quantidade ?? 0),
        price: Number(item?.valor ?? latestBatchItem?.valor ?? 0),
        categoria: item?.categoria ?? "",
        descricao: item?.descricao ?? "",
        isAtivo: item?.ativo ?? item?.isAtivo ?? true,
        type: "fornada",
      }
    })

    const bolosProducts = cakeProducts.map((item) => ({
      id: item?.boloId,
      name: item?.produto ?? "Bolo sem nome",
      quantity: "-",
      price: Number(item?.precoTotal ?? 0),
      categoria: item?.categoria ?? "",
      descricao: item?.saborRecheio ?? "",
      isAtivo: item?.ativo ?? true,
      type: "bolo",
    }))

    const products = [...fornadaProducts, ...bolosProducts]
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))

    return { products }
  }, [query.data])

  return {
    ...query,
    ...normalizedData,
    toggleStatus: toggleStatus.mutate,
    isToggling: toggleStatus.isPending,
  }
}
