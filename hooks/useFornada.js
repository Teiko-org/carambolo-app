import { useState, useEffect } from "react";
import api from "../services/api/api";

const getTimeLeft = (dataFim) => {
  const diff = new Date(dataFim) - new Date();
  if (diff <= 0) return { days: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, expired: false };
};

export const useFornada = () => {
  const [dataFim, setDataFim] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchFornada = async () => {
      try {
        const { data } = await api.get("/fornadas");
        const list = Array.isArray(data) ? data : [data];
        const active = list
          .filter((f) => f.ativo)
          .sort((a, b) => new Date(b.dataFim) - new Date(a.dataFim))[0];

        if (active?.dataFim) {
          setDataFim(active.dataFim);
        }
      } catch (e) {
        console.log("[useFornada] error:", e?.message);
      }
    };

    fetchFornada();
  }, []);

  useEffect(() => {
    if (!dataFim) return;

    // set immediately, then tick every second
    setTimeLeft(getTimeLeft(dataFim));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dataFim));
    }, 1000);

    return () => clearInterval(interval);
  }, [dataFim]);

  return { timeLeft };
};
