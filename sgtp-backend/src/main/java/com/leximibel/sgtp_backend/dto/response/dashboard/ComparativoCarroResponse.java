package com.leximibel.sgtp_backend.dto.response.dashboard;

import java.math.BigDecimal;

public record ComparativoCarroResponse (
        Long carroId,
        String matricula,
        BigDecimal receitaTotal,
        BigDecimal gastoTotal,
        BigDecimal saldo
){}
