package com.leximibel.sgtp_backend.dto.request.usuarios;

import com.leximibel.sgtp_backend.model.enums.Role;
import jakarta.validation.constraints.*;

public record UsuarioRequest(

    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 3, max = 120, message = "O nome deve ter no minimo 3 caracteres e no maximo 120 caracteres")
    String nome,

    @Email(message = "Email invalido")
    @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres")
    String email,

    @NotBlank(message = "Telefone e obrigatorio")
    @Size(min = 9, max = 9, message = "O telefone deve ter no 9 digitos")
    String telefone,

    @NotBlank(message = "Senha e obrigatorio")
    @Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
    String senha,

    @NotNull(message = "Role e obrigatorio")
    Role role
) {}
