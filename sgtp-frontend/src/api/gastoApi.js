import axiosClient from "./axiosClient";

// listar gastos com filtros:
    // - carro
    // - categoria
    // - por data: data de inicio ate data fim
export function listarGastos(filtros = {}) {
  return axiosClient.get("/gastos", { params: filtros });
}

// listar gasto pelo id
export function buscarGastoPorId(id) {
  return axiosClient.get(`/gastos/${id}`);
}

// cadastrar um novo gasto
export function criarGasto(dados) {
  return axiosClient.post("/gastos", dados);
}

// editar gasto pelo id
export function atualizarGasto(id, dados) {
  return axiosClient.put(`/gastos/${id}`, dados);
}

// remover gasto pelo id
export function removerGasto(id) {
  return axiosClient.delete(`/gastos/${id}`);
}

