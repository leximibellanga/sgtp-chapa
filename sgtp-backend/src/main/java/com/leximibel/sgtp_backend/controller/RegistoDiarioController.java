package com.leximibel.sgtp_backend.controller;

import com.leximibel.sgtp_backend.dto.request.registo_diario.RegistoDiarioRequest;
import com.leximibel.sgtp_backend.dto.response.registo_diario.RegistoDiarioResponse;
import com.leximibel.sgtp_backend.model.enums.TipoDia;
import com.leximibel.sgtp_backend.service.RegistoDiarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registos")
@AllArgsConstructor
public class RegistoDiarioController {

    private RegistoDiarioService service;

    // Verifica se o username(email do usuario) do usuario logado eh ROLE_ADMIN
    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }


    /* Listar todos registos - ADMIN */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<RegistoDiarioResponse>> listarRegistos(
            @RequestParam(required = false) Long carroId,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) TipoDia tipoDia
    ) {
        return ResponseEntity.ok(service.listarRegistos(carroId, usuarioId, tipoDia));
    }


    /* Listar apenas os proprios registos - ADMIN ou MOTORISTA */
    @PreAuthorize("hasAnyRole('ADMIN', 'MOTORISTA')")
    @GetMapping("/meus")
    public ResponseEntity<List<RegistoDiarioResponse>> listarMeusRegistos(
            Authentication auth
    ) {
        return ResponseEntity.ok(service.listarMeusRegistos(auth.getName()));
    }


    /* Buscar registro pelo ID - ADMIN ou MOTORISTA */
    @PreAuthorize("hasAnyRole('ADMIN', 'MOTORISTA')")
    @GetMapping("/{id}")
    public ResponseEntity<RegistoDiarioResponse> listarRegistosPeloID(
            @PathVariable Long id,
            Authentication auth
    ) {
        return ResponseEntity.ok(service.listarRegistoPeloId(id, auth.getName(), isAdmin(auth)));
    }


    /* Criar um novo registo - ADMIN ou MOTORISTA */
    @PreAuthorize("hasAnyRole('ADMIN', 'MOTORISTA')")
    @PostMapping
    public ResponseEntity<RegistoDiarioResponse> cadastrarRegisto(
            @Valid @RequestBody RegistoDiarioRequest request,
            Authentication auth
    ) {
        RegistoDiarioResponse response = service.criarNovoRegisto(request, auth.getName(), isAdmin(auth));
        return ResponseEntity.ok(response);
    }


    /* Atualizar registo pelo ID - ADMIN ou MOTORISTA */
    @PreAuthorize("hasAnyRole('ADMIN', 'MOTORISTA')")
    @PutMapping("/{id}")
    public ResponseEntity<RegistoDiarioResponse> cadastrarRegisto(
            @PathVariable Long id,
            @Valid @RequestBody RegistoDiarioRequest request,
            Authentication auth
    ) {
        RegistoDiarioResponse response = service.atualizar(id, request, auth.getName(), isAdmin(auth));
        return ResponseEntity.ok(response);
    }


    /* Eliminar registo pelo ID - ADMIN */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarRegisto(
            @PathVariable Long id
    ) {
        service.deletarRegisto(id);
        return ResponseEntity.ok("Registo deletado com sucesso!");
    }
}
