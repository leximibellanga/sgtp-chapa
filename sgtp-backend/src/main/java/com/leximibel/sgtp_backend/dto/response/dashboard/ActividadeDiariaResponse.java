package com.leximibel.sgtp_backend.dto.response.dashboard;

import java.time.LocalDate;

public record ActividadeDiariaResponse(
        LocalDate data,
        int carrosTrabalharam,
        int totalCarros
) {}
