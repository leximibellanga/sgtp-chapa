package com.leximibel.sgtp_backend.dto.request.usuarios;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateRequest(

    @NotBlank(message = "Nome e obrigario")
    @Size(max = 120, message = "O nome deve ter no maximo 120 caracteres")
    String nome,

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    String email,

    @NotBlank(message = "Telefone e obrigatorio")
    @Size(min = 9, max = 9, message = "Telefone deve ter 9 digitos")
    String telefone
) {}
