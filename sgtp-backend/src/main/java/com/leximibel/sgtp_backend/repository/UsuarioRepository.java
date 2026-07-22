package com.leximibel.sgtp_backend.repository;

import com.leximibel.sgtp_backend.model.Usuario;
import com.leximibel.sgtp_backend.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Pegar usuario pelo email
    Optional<Usuario> findByEmail(String email);

    // Verificar se existe um usuario cadastrado com esse email
    boolean existsByEmail(String email);

    // Verificar se existe um usuario cadastrado com esse telefone
    boolean existsByTelefone(String telefone);

    // Listar usuaios pelo role
    List<Usuario> findByRole(Role role);

    // Listar usuarios ativos
    List<Usuario> findByAtivoTrue();

    // Listar usuarios inativos
    List<Usuario> findByAtivoFalse();

}
