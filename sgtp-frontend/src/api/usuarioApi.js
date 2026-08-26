import axiosClient from "./axiosClient";

// Listar usuarios - GET
export function listarUsuarios(role) {
  const params = role ? { role } : {};
  return axiosClient.get("/usuarios", { params });
}

// Buscar usuario pelo ID - GET
export function buscarUsuarioPeloId(id) {
  return axiosClient.get(`/usuarios/${id}`);
}

// Criar novo usuario - POST
export function criarUsuario(dados) {
  return axiosClient.post("/usuarios", dados);
}

// Atualizar usuario pelo ID - PUT
export function atualizarUsuarioPeloId(id, dados) {
  return axiosClient.put(`/usuarios/${id}`, dados);
}

// Aativar usuario pelo ID - PATCH
export function ativarUsuarioPeloId(id) {
  return axiosClient.patch(`/usuarios/${id}/ativar`);
}

// Desativar usuario pelo ID - PATCH
export function desativarUsuarioPeloId(id) {
  return axiosClient.patch(`/usuarios/${id}/desativar`);
}
