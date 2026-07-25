package com.leximibel.sgtp_backend.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "O email eh obrigatorio")
        @Email(message = "Email invalido")
        String email,

        @NotBlank(message = "A senha eh obrigatoria")
        String senha
) {}
