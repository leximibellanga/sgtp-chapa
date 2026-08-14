import axiosClient from "./axiosClient";

export function buscarResumoMensal(mes) {
  return axiosClient.get("/dashboard/resumo-mensal", {
    params: mes ? { mes } : {},
  });
}

export function buscarEvolucaoMensal(meses = 6) {
  return axiosClient.get("/dashboard/evolucao-mensal", { params: { meses } });
}

export function buscarGastosPorCategoria(mes) {
  return axiosClient.get("/dashboard/gastos-por-categoria", {
    params: mes ? { mes } : {},
  });
}

export function buscarComparativoPorCarro(mes) {
  return axiosClient.get("/dashboard/por-carro", {
    params: mes ? { mes } : {},
  });
}
