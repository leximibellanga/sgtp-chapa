package com.leximibel.sgtp_backend.dto.request.registo_diario;

import com.leximibel.sgtp_backend.model.enums.TipoDia;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistoDiarioRequest(
    @NotNull(message = "O carro e obrigatorio")
    Long carroId,

    // Opcional: se nulo, usa o utilizador autenticado.
    // Admin pode especificar outro usuario (ex: corrigir um lancamento)
    Long usuarioId,

    // Opcional: Se nulo, usa o usa a data de hoje
    LocalDate data,

    @NotNull(message = "O tipo de dia e obrigatorio")
    TipoDia tipoDia,

    @NotNull(message = "O valor entregue e obrigatorio")
    @PositiveOrZero(message = "O valor entregue nao pode ser negativo")
    BigDecimal valorEntregue,

    String justificativa
) {}
