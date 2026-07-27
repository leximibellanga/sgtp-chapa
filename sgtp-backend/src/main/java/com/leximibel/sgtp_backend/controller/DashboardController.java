package com.leximibel.sgtp_backend.controller;

import com.leximibel.sgtp_backend.dto.response.dashboard.ComparativoCarroResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.EvolucaoMensalResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.GastoPorCategoriaResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.ResumoMensalResponse;
import com.leximibel.sgtp_backend.service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")   // so o admin tem permissao para aceder a essa rota
public class DashboardController {

    private DashboardService dashboardService;

    // Resumo mensal: receita_total, gasto_total, saldo(lucro) com filtro de mes(se nao for especificado o mes o sistema pega o mes atual)
    @GetMapping("/resumo-mensal")
    public ResponseEntity<ResumoMensalResponse> resumoMensal(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes
    ) {
        return ResponseEntity.ok(dashboardService.resumoMensal(mes));
    }

    // Evolucao mensal:
    @GetMapping("/evolucao-mensal")
    public ResponseEntity<List<EvolucaoMensalResponse>> evolucaoMensal(
            @RequestParam(defaultValue = "6") int meses
    ) {
        return ResponseEntity.ok(dashboardService.evolucaoMensal(meses));
    }

    // Gastos por categoria, com filtro de mes
    @GetMapping("/gastos-por-categoria")
    public ResponseEntity<List<GastoPorCategoriaResponse>> gastoPorCategoria(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes
    ) {
        return ResponseEntity.ok(dashboardService.gastoPorCategorias(mes));
    }

    // Comparativo dos carros, para saber qual carro tem mais: receita, gasto e saldo
    @GetMapping("/por-carro")
    public ResponseEntity<List<ComparativoCarroResponse>> comparativoPorCarro(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes
    ) {
        return ResponseEntity.ok(dashboardService.comparativoCarro(mes));
    }
}
