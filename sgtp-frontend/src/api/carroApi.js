import axiosClient from "./axiosClient";

export function listarCarros(apenasAtivos) {
  const params = apenasAtivos !== undefined ? { apenasAtivos } : {};
  return axiosClient.get("/carros", { params });
}

export function buscarCarroPeloId(id) {
  return axiosClient.get(`/carros/${id}`);
}

export function criarCarro(dados) {
  return axiosClient.post("/carros", dados);
}

export function atualizarCarro(id, dados) {
  return axiosClient.put(`/carros/${id}`, dados);
}

export function desativarCarro(id) {
  return axiosClient.patch(`/carros/${id}/desativar`);
}

export function ativarCarro(id) {
  return axiosClient.patch(`/carros/${id}/ativar`);
}
