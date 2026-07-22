package com.leximibel.sgtp_backend.repository;

import com.leximibel.sgtp_backend.model.RegistoDiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistoDiarioRepository extends JpaRepository<RegistoDiario, Long> {
    // Retorna Lista de registos diarios de um certo usuario
    List<RegistoDiario> findByUsuario(Long usuario_id);

    // Retorna Lista de registos diarios de um certo carro
    List<RegistoDiario> findByCarro(Long carro_id);

    // Retorna Lista de registos diarios de um certo usuario com filtro de data [inicio e fim]
    List<RegistoDiario> findByUsuarioAndDataBetween(Long usuario_id, LocalDate inicio, LocalDate fim);

    // Retorna Lista de registos diarios com filtro de data [inicio e fim]
    List<RegistoDiario> findByDataBetween(LocalDate inicio, LocalDate fim);

    // Retorna o registo do usuario_id na data estabelecida no parametro
    Optional<RegistoDiario> findByUsuarioIdAndData(Long usuario_id, LocalDate data);
}
