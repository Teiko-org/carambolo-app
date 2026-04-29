import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadAndRunETL, getETLStatus } from "../services/etlService";

/**
 * Hook para gerenciar o upload de arquivos e execução do ETL.
 * Usa React Query useMutation para controle de estado.
 */
export const useETL = () => {
  const [resultado, setResultado] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: (files) => uploadAndRunETL(files),
    onSuccess: (data) => {
      setResultado(data);
      console.log("ETL concluído:", data);
    },
    onError: (error) => {
      let mensagem = "Erro desconhecido ao executar ETL";
      
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          // Extrair mensagem de erro de validação do FastAPI
          mensagem = detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
        } else if (typeof detail === "string") {
          mensagem = detail;
        } else {
          mensagem = JSON.stringify(detail);
        }
      } else if (error?.message) {
        mensagem = error.message;
      }

      setResultado({
        status: "error",
        message: mensagem,
      });
      console.log("Erro ETL:", mensagem);
    },
  });

  const statusMutation = useMutation({
    mutationFn: () => getETLStatus(),
  });

  const executarETL = (files) => {
    setResultado(null);
    uploadMutation.mutate(files);
  };

  const verificarStatus = () => {
    statusMutation.mutate();
  };

  const limparResultado = () => {
    setResultado(null);
    uploadMutation.reset();
  };

  return {
    executarETL,
    verificarStatus,
    limparResultado,
    resultado,
    isLoading: uploadMutation.isPending,
    isSuccess: uploadMutation.isSuccess,
    isError: uploadMutation.isError,
    error: uploadMutation.error,
    serverOnline: statusMutation.isSuccess,
  };
};
