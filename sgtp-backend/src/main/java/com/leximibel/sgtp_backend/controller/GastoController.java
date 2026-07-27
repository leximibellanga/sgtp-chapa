package com.leximibel.sgtp_backend.controller;

import com.leximibel.sgtp_backend.dto.request.gasto.GastoRequest;
import com.leximibel.sgtp_backend.dto.response.gasto.GastoResponse;
import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import com.leximibel.sgtp_backend.service.GastoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GastoController {

    private GastoService gastoService;

    // Listar todos gastos com filtros de: carro, categoria, data_inicio e data_fim
    @GetMapping
    public ResponseEntity<List<GastoResponse>> listarGastos(
            @RequestParam(required = false) Long carro,
            @RequestParam(required = false) CategoriaGasto categoria,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data_inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data_fim
    ) {
        return ResponseEntity.ok(gastoService.listarGastos(carro, categoria, data_inicio, data_fim));
    }

    // Lista gasto pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<GastoResponse> listarGastoPeloI(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(gastoService.listarGastoPeloId(id));
    }

    // Cadastrar novo gasto
    @PostMapping
    public ResponseEntity<GastoResponse> cadastrarGasto(
            @Valid @RequestBody GastoRequest request,
            Authentication auth
    ) {
        GastoResponse response = gastoService.criarGasto(request, auth.getName());
        return ResponseEntity.status(201).body(response);
    }

    // Atualizar gasto pelo ID
    @PutMapping("/{id}")
    public ResponseEntity<GastoResponse> atualizarGasto(
            @PathVariable Long id,
            @Valid @RequestBody GastoRequest request
    ) {
        return ResponseEntity.ok(gastoService.atualizarGasto(id, request));
    }

    // Deletar gasto
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarGasto(
            @PathVariable Long id
    ) {
        gastoService.deletarGasto(id);
        return ResponseEntity.ok("Gasto deletado com sucesso!");
    }
}
