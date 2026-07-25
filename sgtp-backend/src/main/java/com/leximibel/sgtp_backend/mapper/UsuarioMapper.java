package com.leximibel.sgtp_backend.mapper;

import com.leximibel.sgtp_backend.dto.response.usuarios.UsuarioResponse;
import com.leximibel.sgtp_backend.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsuarioMapper {

    // Transformar: Usuario -> UsuarioDTO
    public static UsuarioResponse toResponseDTO(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getRole(),
                usuario.isAtivo(),
                usuario.getCriadoEm()
        );
    }

    // Transformar: List<Usuario> -> List<UsuarioDTO>
    public static List<UsuarioResponse> toResponseListDTO(List<Usuario> usuarios) {
        return usuarios.stream().map(UsuarioMapper::toResponseDTO).toList();
    }
}
