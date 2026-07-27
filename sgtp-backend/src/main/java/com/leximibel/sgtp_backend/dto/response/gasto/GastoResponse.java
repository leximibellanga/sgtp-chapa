package com.leximibel.sgtp_backend.dto.response.gasto;

import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GastoResponse(
        Long id,
        Long carroId,
        String carroMatricula,
        CategoriaGasto categoriaGasto,
        BigDecimal valor,
        LocalDate data,
        String descricao,
        Long registadoPorId,
        String registadoPorNome,
        LocalDateTime criadoEm
) {}
