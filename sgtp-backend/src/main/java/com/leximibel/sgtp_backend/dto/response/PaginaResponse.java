package com.leximibel.sgtp_backend.dto.response;

import java.util.List;

public record PaginaResponse<T> (
        List<T> conteudo,
        int paginaActual,
        int totalPaginas,
        long totalElementos,
        boolean primeira,
        boolean ultima
) {}
