package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioRequest;
import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioUpdateRequest;
import com.leximibel.sgtp_backend.dto.response.usuarios.UsuarioResponse;
import com.leximibel.sgtp_backend.entity.enums.Role;

import java.util.List;

public interface UsuarioService {

    // Listar usuarios sem filtro de Role e com filtro de Role
    public List<UsuarioResponse> listarUsuarios(Role role);

    // Buscar usuario pelo ID
    public UsuarioResponse listarUsuarioPeloId(Long id);

    // Criar um novo usuario
    public UsuarioResponse criarUsuario(UsuarioRequest usuarioRequest);

    // Actualizar usuario pelo id
    public UsuarioResponse atualizarUsuarioPeloId(Long id, UsuarioUpdateRequest usuarioUpdateRequest);

    // Ativar usuario
    public UsuarioResponse ativarUsuarioPeloId(Long id);

    // Desativar usuario (Soft Delete)
    public UsuarioResponse desativarUsuarioPeloId(Long id);
}
