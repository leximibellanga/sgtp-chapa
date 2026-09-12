package com.leximibel.sgtp_backend.dto.response.usuarios;

import com.leximibel.sgtp_backend.entity.enums.Role;

import java.time.LocalDateTime;

public record UsuarioResponse (
        Long id,
        String nome,
        String email,
        String telefone,
        Role role,
        boolean ativo,
        LocalDateTime criadoEm
) {}
