package com.leximibel.sgtp_backend.dto.request.carro;

import jakarta.validation.constraints.*;

public record CarroRequest(

    @NotBlank(message = "A matricula e obrigatoria")
    @Size(max = 20, message = "A matricula deve ter no maximo 20 caracteres")
    String matricula,

    @NotNull(message = "O modelo e obrigatorio")
    @Size(max = 80, message = "O modelo deve ter no maximo 80 caracteres")
    String modelo,

    @NotNull(message = "O ano e obrigatorio")
    @Min(value = 1800, message = "Ano invalido")
    @Max(value = 2026, message = "Ano invalido")
    Integer ano,

    @NotBlank(message = "A rota e obrigatoria")
    @Size(max = 100, message = "A rota deve ter no maximo 100 caracteres")
    String rota
) {}
