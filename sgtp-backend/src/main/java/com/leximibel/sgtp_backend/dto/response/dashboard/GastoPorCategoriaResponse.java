package com.leximibel.sgtp_backend.dto.response.dashboard;

import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;

import java.math.BigDecimal;

public record GastoPorCategoriaResponse(
        CategoriaGasto categoria,
        BigDecimal total
){}
