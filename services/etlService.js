import etlApi from "./api/etlApi";
import { Platform } from "react-native";

/**
 * Envia arquivos e executa o pipeline ETL.
 * @param {Array} files - Array de objetos de arquivo do DocumentPicker
 *   Cada item: { uri, name, mimeType, file }
 * @returns {Promise<Object>} Resultado do ETL
 */
export const uploadAndRunETL = async (files) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      if (Platform.OS === "web" && file.file) {
        // Na Web, expo-document-picker retorna um objeto nativo File em `file.file`
        formData.append("files", file.file);
      } else {
        // No mobile (iOS/Android)
        formData.append("files", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        });
      }
    });

    const { data } = await etlApi.post("/etl/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (e) {
    console.log("Erro no upload ETL:", e?.response?.data || e.message);
    throw e;
  }
};

/**
 * Verifica se o servidor ETL está ativo.
 * @returns {Promise<Object>} Status do servidor
 */
export const getETLStatus = async () => {
  try {
    const { data } = await etlApi.get("/etl/status");
    return data;
  } catch (e) {
    console.log("Erro ao verificar status ETL:", e.message);
    throw e;
  }
};

/**
 * Busca contagem de registros por tabela.
 * @returns {Promise<Object>} Contagens das tabelas
 */
export const getTableCounts = async () => {
  try {
    const { data } = await etlApi.get("/etl/tables");
    return data;
  } catch (e) {
    console.log("Erro ao buscar contagem de tabelas:", e.message);
    throw e;
  }
};

/**
 * Lista arquivos atualmente em data/raw/.
 * @returns {Promise<Object>} Lista de arquivos
 */
export const getRawFiles = async () => {
  try {
    const { data } = await etlApi.get("/etl/files");
    return data;
  } catch (e) {
    console.log("Erro ao listar arquivos:", e.message);
    throw e;
  }
};
