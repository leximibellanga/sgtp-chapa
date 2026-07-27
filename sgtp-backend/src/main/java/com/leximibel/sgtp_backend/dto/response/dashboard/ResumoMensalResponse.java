package com.leximibel.sgtp_backend.dto.response.dashboard;

import java.math.BigDecimal;

public record ResumoMensalResponse (
        String mes,
        BigDecimal receitaTotal,
        BigDecimal gastoTotal,
        BigDecimal saldo,
        int CarrosAtivos
){}
