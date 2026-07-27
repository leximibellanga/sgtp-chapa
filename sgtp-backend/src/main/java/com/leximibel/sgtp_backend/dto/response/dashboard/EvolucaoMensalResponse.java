package com.leximibel.sgtp_backend.dto.response.dashboard;

import java.math.BigDecimal;

public record EvolucaoMensalResponse (
        String mes,
        BigDecimal receita,
        BigDecimal gasto,
        BigDecimal saldo
){}
