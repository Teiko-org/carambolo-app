import api from "./api/api"

export const getProducts = async ({ categorias = [], page = 0, size = 100 } = {}) => {
  try {
    const params = { page, size }
    if (Array.isArray(categorias) && categorias.length > 0) {
      params.categorias = categorias
    }
    const { data } = await api.get("/fornadas/produto-fornada", {
      params,
      paramsSerializer: { indexes: null },
    })
    return data
  } catch (e) {
    console.log("error getting products: ", e)
    throw e
  }
}

export const getLatestBatchProducts = async () => {
  try {
    const { data } = await api.get("/fornadas/mais-recente/produtos")
    return data
  } catch (e) {
    console.log("error getting latest batch products: ", e)
    throw e
  }
}

export const getCakeProducts = async ({ categorias = [] } = {}) => {
  try {
    const params = {}
    if (Array.isArray(categorias) && categorias.length > 0) {
      params.categorias = categorias
    }
    const { data } = await api.get("/bolos/detalhe", { params })
    return data
  } catch (e) {
    console.log("error getting cake products: ", e)
    throw e
  }
}

export const updateFornadaStatus = async (id, isAtivo) => {
  try {
    await api.patch(`/fornadas/produto-fornada/status/${id}`, { isAtivo })
  } catch (e) {
    console.log("error updating fornada status: ", e)
    throw e
  }
}

export const updateBoloStatus = async (id, isAtivo) => {
  try {
    await api.patch(`/bolos/atualizar-status/${id}`, { isAtivo })
  } catch (e) {
    console.log("error updating bolo status: ", e)
    throw e
  }
}

export const createFornada = async ({ produto, descricao, valor, categoria }) => {
  try {
    const formData = new FormData()
    formData.append("produto", produto)
    formData.append("descricao", descricao)
    formData.append("valor", valor)
    formData.append("categoria", categoria)
    const { data } = await api.post("/fornadas/produto-fornada", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  } catch (e) {
    console.log("error creating fornada: ", e)
    throw e
  }
}

export const getAdicionais = async () => {
  try {
    const { data } = await api.get("/adicionais")
    return data
  } catch (e) {
    console.log("error getting adicionais: ", e)
    throw e
  }
}

export const getDecoracoes = async () => {
  try {
    const { data } = await api.get("/decoracoes")
    return data
  } catch (e) {
    console.log("error getting decoracoes: ", e)
    throw e
  }
}

export const createDecoracao = async ({ nome, categoria, observacao, adicionais }) => {
  try {
    const formData = new FormData()
    formData.append("nome", nome)
    formData.append("observacao", observacao ?? "")
    if (categoria) formData.append("categoria", categoria)
    if (adicionais && adicionais.length > 0) {
      formData.append("adicionais", adicionais.map((a) => a.id).join(","))
    }
    const { data } = await api.post("/decoracoes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  } catch (e) {
    console.log("error creating decoracao: ", e)
    throw e
  }
}
