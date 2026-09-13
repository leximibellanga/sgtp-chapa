package com.leximibel.sgtp_backend.service.impl;

import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioRequest;
import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioUpdateRequest;
import com.leximibel.sgtp_backend.dto.response.usuarios.UsuarioResponse;
import com.leximibel.sgtp_backend.entity.Usuario;
import com.leximibel.sgtp_backend.entity.enums.Role;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.UsuarioMapper;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import com.leximibel.sgtp_backend.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    // injectar via construtor
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.repository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Metodo auxiliar para buscar usuario pelo ID.
    private Usuario buscarUsuarioPeloId(Long id) {
        return repository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado: " + id));
    }

    /* ======================================================================================================================= */
    @Override
    public List<UsuarioResponse> listarUsuarios(Role role) {
        List<Usuario> usuarios = (role != null) ? repository.findByRole(role) : repository.findAll();
        return UsuarioMapper.toResponseListDTO(usuarios);
    }

    @Override
    public UsuarioResponse listarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        return UsuarioMapper.toResponseDTO(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponse criarUsuario(UsuarioRequest usuarioRequest) {
        // verificar se existe um usuario com esse email na BD
        if (repository.existsByEmail(usuarioRequest.email())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este email");
        }
        // verificar se existe um usuario com esse telefone na BD
        if (repository.existsByTelefone(usuarioRequest.telefone())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este telefone");
        }
        // criptografar senha
        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.senha());
        // criar usuario
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.nome());
        usuario.setEmail(usuarioRequest.email());
        usuario.setTelefone(usuarioRequest.telefone());
        usuario.setSenha(senhaCriptografada);
        usuario.setRole(usuarioRequest.role());
        usuario.setAtivo(true);
        // salvar, fechar BD e retornar dados do ussuario cadastrado
        return UsuarioMapper.toResponseDTO(repository.saveAndFlush(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse atualizarUsuarioPeloId(Long id, UsuarioUpdateRequest usuarioUpdateRequest) {
        Usuario usuario = buscarUsuarioPeloId(id);
        // verificar se existe um usuario com esse email na BD
        if (repository.existsByEmail(usuarioUpdateRequest.email())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este email");
        }
        // verificar se existe um usuario com esse telefone na BD
        if (repository.existsByTelefone(usuarioUpdateRequest.telefone())) {
            throw new RegraDeNegocioException("Ja existe um usuario com este telefone");
        }
        // Atualizar: Nome, Email e Telefone
        usuario.setNome(usuarioUpdateRequest.nome());
        usuario.setEmail(usuarioUpdateRequest.email());
        usuario.setTelefone(usuarioUpdateRequest.telefone());
        // salvar, fechar BD e retornar os dados ja salvos
        return UsuarioMapper.toResponseDTO(repository.saveAndFlush(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse desativarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        usuario.setAtivo(false);
        return UsuarioMapper.toResponseDTO(repository.saveAndFlush(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse ativarUsuarioPeloId(Long id) {
        Usuario usuario = buscarUsuarioPeloId(id);
        usuario.setAtivo(true);
        return UsuarioMapper.toResponseDTO(repository.saveAndFlush(usuario));
    }
}
