package com.leximibel.sgtp_backend.repository;

import com.leximibel.sgtp_backend.model.Gasto;
import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GastoRepository extends JpaRepository<Gasto, Long> {
    // Listar gastos com filtro de carro, EX: todos gastos do carro com ID=2
    List<Gasto> findByCarroId(Long carro_id);

    // Listar gastos em categorias
    List<Gasto> findByCategoria(CategoriaGasto categoriaGasto);

    // Lista de gastos de um certo periodo de tempo, de inicio ate fim | EX: inicio: 2026-07-20 ate fim: 2026-07-22
    List<Gasto> findByDataBetween(LocalDate inicio, LocalDate fim);

    // Lista de gastos de um carro com o ID, em certo periodo de tempo, de inicio ate fim. | EX: carro_id: 1, inicio: 2026-07-20 ate fim: 2026-07-22
    List<Gasto> findByCarroIdAndDataBetween(Long carro_id, LocalDate inicio, LocalDate fim);

}
