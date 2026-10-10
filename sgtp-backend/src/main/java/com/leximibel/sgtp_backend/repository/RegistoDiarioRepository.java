package com.leximibel.sgtp_backend.repository;

import com.leximibel.sgtp_backend.entity.RegistoDiario;
import com.leximibel.sgtp_backend.entity.enums.TipoDia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RegistoDiarioRepository extends JpaRepository<RegistoDiario, Long> {
    // Retorna Lista de registos diarios de um certo usuario
    List<RegistoDiario> findByUsuarioId(Long usuario_id);

    // Retorna Lista de registos diarios de um certo carro
    List<RegistoDiario> findByCarroId(Long carro_id);

    // Retorna Lista de registos diarios de um certo usuario com filtro de data [inicio e fim]
    List<RegistoDiario> findByUsuarioIdAndDataBetween(Long usuario_id, LocalDate inicio, LocalDate fim);

    // Retorna Lista de registos diarios com filtro de data [inicio e fim]
    List<RegistoDiario> findByDataBetween(LocalDate inicio, LocalDate fim);

    // Retorna o registo do usuario_id na data estabelecida no parametro
    Optional<RegistoDiario> findByUsuarioIdAndData(Long usuario_id, LocalDate data);

    // Retorna Lista de registos diarios ordenados pela data [presente - passado]
    List<RegistoDiario> findByOrderByDataDesc();

    // -------
    @Query("""
        SELECT r FROM RegistoDiario r
        WHERE (:carroId IS NULL OR r.carro.id = :carroId)
        AND (:usuarioId IS NULL OR r.usuario.id = :usuarioId)
        AND (:tipoDia IS NULL OR r.tipoDia = :tipoDia)
        ORDER BY r.data DESC
        """)
    Page<RegistoDiario> buscarComFiltros(
            @Param("carroId") Long carroId,
            @Param("usuarioId") Long usuarioId,
            @Param("tipoDia") TipoDia tipoDia,
            Pageable pageable
    );

    @Query("""
        SELECT r FROM RegistoDiario r
        WHERE r.usuario.id = :usuarioId
        ORDER BY r.data DESC
        """)
    Page<RegistoDiario> buscarPorUsuario(@Param("usuarioId") Long usuarioId, Pageable pageable);
}
