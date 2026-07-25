package com.leximibel.sgtp_backend.dto.response.carro;

import java.time.LocalDateTime;

public record CarroResponse(
    Long id,
    String matricula,
    String modelo,
    Integer ano,
    String rota,
    boolean ativo,
    LocalDateTime criadoEm
) {}
