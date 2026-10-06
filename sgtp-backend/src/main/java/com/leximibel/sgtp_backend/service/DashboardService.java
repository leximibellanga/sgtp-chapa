package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.response.dashboard.*;

import java.time.YearMonth;
import java.util.List;

public interface DashboardService{
    // 1. RESUMO MENSAL
    public ResumoMensalResponse resumoMensal(YearMonth mes);

    // 2. EVOLUCAO MENSAL (ultimos N meses)
    public List<EvolucaoMensalResponse> evolucaoMensal(int meses);

    // 3. GASTOS POR CATEGORIA
    public List<GastoPorCategoriaResponse> gastoPorCategorias(YearMonth mes);

    // 4. COMPARATIVO ENTRE CARROS
    public List<ComparativoCarroResponse> comparativoCarro(YearMonth mes);

    // 5. MAPA DE ACTIVIDADE DIARIO (ultimos 90 dias)
    public List<ActividadeDiariaResponse> mapaActividade(int ano);
}
