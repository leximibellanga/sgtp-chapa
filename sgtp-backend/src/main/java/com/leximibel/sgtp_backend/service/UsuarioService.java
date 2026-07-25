package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioRequest;
import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioUpdateRequest;
import com.leximibel.sgtp_backend.dto.response.usuarios.UsuarioResponse;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.UsuarioMapper;
import com.leximibel.sgtp_backend.model.Usuario;
import com.leximibel.sgtp_backend.model.enums.Role;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UsuarioService {
    private UsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder;

    // Metodo auxiliar para buscar usuasrio pelo ID.
    private Usuario buscarUsuarioPeloId(Long id) {
        return usuarioRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado: " + id));
    }

    // ========== CRUD ===========
    // Listar usuarios sem filtro de Role e com filtro de Role
    public List<UsuarioResponse> listarUsuarios(Role role) {
        List<Usuario> usuarios = (role != null) ? usuarioRepository.findByRole(role) : usuarioRepository.findAll();
        return UsuarioMapper.toResponseListDTO(usuarios);
    }

    // Buscar usuario pelo ID
    public UsuarioResponse listarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        return UsuarioMapper.toResponseDTO(usuario);
    }

    // Criar um novo usuario
    public UsuarioResponse criarUsuario(UsuarioRequest usuarioRequest) {
        // verificar se existe um usuario com esse email na BD
        if (usuarioRepository.existsByEmail(usuarioRequest.email())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este email");
        }
        // verificar se existe um usuario com esse telefone na BD
        if (usuarioRepository.existsByTelefone(usuarioRequest.telefone())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este telefone");
        }
        // ======= criar usuario
        // criptografar senha
        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.senha());
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.nome());
        usuario.setEmail(usuarioRequest.email());
        usuario.setTelefone(usuarioRequest.telefone());
        usuario.setSenha(senhaCriptografada);
        usuario.setRole(usuarioRequest.role());
        usuario.setAtivo(true);
        // salvar, fechar BD e retornar dados do ussuario cadastrado
        return UsuarioMapper.toResponseDTO(usuarioRepository.saveAndFlush(usuario));
    }

    // Actualizar usuario pelo id
    public UsuarioResponse atualizarUsuarioPeloId(Long id, UsuarioUpdateRequest usuarioUpdateRequest) {
        Usuario usuario = buscarUsuarioPeloId(id);
        // verificar se existe um usuario com esse email na BD
        if (usuarioRepository.existsByEmail(usuarioUpdateRequest.email())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este email");
        }
        // verificar se existe um usuario com esse telefone na BD
        if (usuarioRepository.existsByTelefone(usuarioUpdateRequest.telefone())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este telefone");
        }
        // Atualizar: Nome, Email e Telefone
        usuario.setNome(usuarioUpdateRequest.nome());
        usuario.setEmail(usuarioUpdateRequest.email());
        usuario.setTelefone(usuarioUpdateRequest.telefone());
        // salvar, fechar BD e retornar os dados ja salvos
        return UsuarioMapper.toResponseDTO(usuarioRepository.saveAndFlush(usuario));
    }

    // Desativar usuario (Soft Delete)
    public UsuarioResponse desativarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        usuario.setAtivo(false);
        return UsuarioMapper.toResponseDTO(usuarioRepository.saveAndFlush(usuario));
    }

    // Ativar usuario
    public UsuarioResponse ativarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        usuario.setAtivo(true);
        return UsuarioMapper.toResponseDTO(usuarioRepository.saveAndFlush(usuario));
    }
}
