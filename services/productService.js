import api from "./api/api"

export const getProducts = async ({ categorias = [], page = 0, size = 100 } = {}) => {
  try {
    const params = {
      page,
      size,
    }

    if (Array.isArray(categorias) && categorias.length > 0) {
      params.categorias = categorias
    }

    const { data } = await api.get("/fornadas/produto-fornada", {
      params,
      paramsSerializer: {
        indexes: null,
      },
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
