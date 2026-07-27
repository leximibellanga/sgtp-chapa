package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.response.dashboard.ComparativoCarroResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.EvolucaoMensalResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.GastoPorCategoriaResponse;
import com.leximibel.sgtp_backend.dto.response.dashboard.ResumoMensalResponse;
import com.leximibel.sgtp_backend.model.Carro;
import com.leximibel.sgtp_backend.model.Gasto;
import com.leximibel.sgtp_backend.model.RegistoDiario;
import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.repository.GastoRepository;
import com.leximibel.sgtp_backend.repository.RegistoDiarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private RegistoDiarioRepository registoRepository;
    private GastoRepository gastoRepository;
    private CarroRepository carroRepository;

    // ============== Metodos Auxiliares =============
    // 1. Somar valores entregues nos registos diarios
    private BigDecimal somarValorEntregue(List<RegistoDiario> registos) {
        return registos.stream()
                .map(RegistoDiario::getValorEntregue)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // 2. Somar todos gastos
    private BigDecimal somarValorGasto(List<Gasto> gastos) {
        return gastos.stream()
                .map(Gasto::getValor)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    // ============== 1. RESUMO MENSAL ===============
    public ResumoMensalResponse resumoMensal(YearMonth mes) {
        YearMonth referencia = (mes != null) ? mes : YearMonth.now();   // Se o mes for nulo, pega o mes atual
        LocalDate inicio = referencia.atDay(1);             // Pega dia 01 do mes
        LocalDate fim = referencia.atEndOfMonth();                      // Pega o ultimo dia do mes (28/29/30/31)

        BigDecimal receitaTotal = somarValorEntregue(registoRepository.findByDataBetween(inicio, fim));
        BigDecimal gastoTotal = somarValorGasto(gastoRepository.findByDataBetween(inicio, fim));
        int carrosAtivos = carroRepository.findByAtivoTrue().size();

        return new ResumoMensalResponse(
                referencia.toString(),
                receitaTotal,
                gastoTotal,
                receitaTotal.subtract(gastoTotal),
                carrosAtivos
        );
    }

    // ============== 2. EVOLUCAO MENSAL (ultimos N meses) ===============
    public List<EvolucaoMensalResponse> evolucaoMensal(int meses) {
        YearMonth mesAtual = YearMonth.now();

        return java.util.stream.IntStream.rangeClosed(0, meses - 1)
                .mapToObj(mesAtual::minusMonths)
                .sorted()
                .map(mes -> {
                    LocalDate inicio = mes.atDay(1);
                    LocalDate fim = mes.atEndOfMonth();

                    BigDecimal receita = somarValorEntregue(registoRepository.findByDataBetween(inicio, fim));
                    BigDecimal gasto = somarValorGasto(gastoRepository.findByDataBetween(inicio, fim));
                    BigDecimal saldo = receita.subtract(gasto);
                    String label = mes.getMonth().getDisplayName(TextStyle.FULL, new Locale("pt"))+ " de " + mes.getYear();

                    return new EvolucaoMensalResponse(
                            label,
                            receita,
                            gasto,
                            saldo
                    );
                }).toList();
    }

    // ================== 3. GASTOS POR CATEGORIA =================
    public List<GastoPorCategoriaResponse> gastoPorCategorias(YearMonth mes) {
        List<Gasto> gastos = (mes != null)
                ? gastoRepository.findByDataBetween(mes.atDay(1), mes.atEndOfMonth())
                : gastoRepository.findAll();

        Map<CategoriaGasto, BigDecimal> totaisPorCategoria = gastos.stream().collect(Collectors.groupingBy(
                Gasto::getCategoria,
                Collectors.reducing(BigDecimal.ZERO, Gasto::getValor, BigDecimal::add)
        ));

        return totaisPorCategoria.entrySet().stream()
                .map(entry -> new GastoPorCategoriaResponse(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(GastoPorCategoriaResponse::total).reversed())
                .toList();
    }

    // ================== 4. COMPARATIVO ENTRE CARROS =============
    public List<ComparativoCarroResponse> comparativoCarro(YearMonth mes) {
        YearMonth referencia = (mes != null) ? mes : YearMonth.now();
        LocalDate inicio = referencia.atDay(1);
        LocalDate fim = referencia.atEndOfMonth();

        List<Carro> carros = carroRepository.findByAtivoTrue();

        return carros.stream().map(carro -> {
            BigDecimal receita = somarValorEntregue(
                    registoRepository.findByDataBetween(inicio, fim).stream()
                            .filter(r -> r.getCarro().getId().equals(carro.getId()))
                            .toList()
            );
            BigDecimal gasto = somarValorGasto(
                    gastoRepository.findByDataBetween(inicio, fim).stream()
                            .filter(g -> g.getCarro().getId().equals(carro.getId()))
                            .toList()
            );
            BigDecimal saldo = receita.subtract(gasto);

            return new ComparativoCarroResponse(
                    carro.getId(),
                    carro.getMatricula(),
                    receita,
                    gasto,
                    saldo
            );
        }).toList();
    }



}
