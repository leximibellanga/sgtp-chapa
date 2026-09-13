package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.response.dashboard.ComparativoCarroResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.EvolucaoMensalResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.GastoPorCategoriaResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.ResumoMensalResponse;

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
}
