import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createDecoracao, createFornada, getAdicionais } from "../services/productService"

export const useAddProduct = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient()
  const [tipo, setTipo] = useState("")

  const adicionaisQuery = useQuery({
    queryKey: ["adicionais"],
    queryFn: getAdicionais,
  })

  const fornadaMutation = useMutation({
    mutationFn: createFornada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onSuccess?.()
    },
  })

  const decoracaoMutation = useMutation({
    mutationFn: createDecoracao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onSuccess?.()
    },
  })

  const isLoading = fornadaMutation.isPending || decoracaoMutation.isPending
  const isError = fornadaMutation.isError || decoracaoMutation.isError

  const submit = (fields) => {
    if (tipo === "Fornada") {
      fornadaMutation.mutate(fields)
    } else if (tipo === "Decoracao") {
      decoracaoMutation.mutate(fields)
    }
  }

  return {
    tipo,
    setTipo,
    adicionais: adicionaisQuery.data ?? [],
    submit,
    isLoading,
    isError,
  }
}
