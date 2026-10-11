import axiosClient from "./axiosClient";

export function listarRegistos(filtros = {}) {
  return axiosClient.get("/registos/paginacao", { params: filtros });
}

export function listarMeusRegistos() {
  return axiosClient.get("/registos/paginacao/meus");
}

export function buscarRegistoPorId(id) {
  return axiosClient.get(`/registos/${id}`);
}

export function criarRegisto(dados) {
  return axiosClient.post("/registos", dados);
}

export function atualizarRegisto(id, dados) {
  return axiosClient.put(`/registos/${id}`, dados);
}

export function removerRegisto(id) {
  return axiosClient.delete(`/registos/${id}`);
}
