import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../services/api/api"
import {
  getCakeProducts,
  getDecoracoes,
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
      const [productsResponse, latestBatchProducts, cakeProducts, decoracoes] = await Promise.all([
        getProducts(),
        getLatestBatchProducts(),
        getCakeProducts(),
        getDecoracoes(),
      ])
      return { productsPage: productsResponse, latestBatchProducts, cakeProducts, decoracoes }
    },
  })

  const toggleStatus = useMutation({
    mutationFn: async ({ id, type, isAtivo }) => {
      if (type === "bolo") {
        await updateBoloStatus(id, isAtivo)
      } else if (type === "decoracao") {
        // Decorações use the same endpoint pattern as bolos
        await api.patch(`/decoracoes/atualizar-status/${id}`, { isAtivo })
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
        } else if (type === "decoracao") {
          return {
            ...old,
            decoracoes: old.decoracoes.map((item) =>
              item?.id === id ? { ...item, isAtivo } : item
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

    const decoracoes = Array.isArray(query.data?.decoracoes)
      ? query.data.decoracoes
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
        imageUrl: item?.imagens?.[0]?.url ?? null,
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

    const decoracoesProducts = decoracoes.map((item) => ({
      id: item?.id,
      name: item?.nome ?? "Decoração sem nome",
      quantity: "-",
      price: 0,
      categoria: item?.categoria ?? "",
      descricao: item?.observacao ?? "",
      isAtivo: item?.isAtivo ?? true,
      type: "decoracao",
      imageUrl: item?.imagens?.[0] ?? null
    }))

    const products = [...fornadaProducts, ...bolosProducts, ...decoracoesProducts]
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
