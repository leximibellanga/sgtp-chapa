package com.leximibel.sgtp_backend.dto.response.registo_diario;

import com.leximibel.sgtp_backend.model.enums.TipoDia;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RegistoDiarioResponse(
    Long id,
    Long carroId,
    String carroMatricula,
    Long usuarioId,
    String usuarioNome,
    LocalDate data,
    TipoDia tipoDia,
    BigDecimal valorEntregue,
    BigDecimal receita,
    String justificativa,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}
