package com.leximibel.sgtp_backend.repository;

import com.leximibel.sgtp_backend.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarroRepository extends JpaRepository<Carro, Long> {
    // Pegar carro pela matricula
    Optional<Carro> findByMatricula(String matricula);

    // Verificar se existe um carro com essa matricula
    boolean existsByMatricula(String matricula);

    // Listar carros ativos
    List<Carro> findByAtivoTrue();

    // Listar carros inativos
    List<Carro> findByAtivoFalse();

}
