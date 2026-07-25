package com.leximibel.sgtp_backend.controller;

import com.leximibel.sgtp_backend.dto.request.carro.CarroRequest;
import com.leximibel.sgtp_backend.dto.response.carro.CarroResponse;
import com.leximibel.sgtp_backend.service.CarroService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carros")
@AllArgsConstructor
public class CarroController {

    private CarroService carroService;

    /* Listar carros - ADMIN e MOTORISTA podem ver (motorista escolhe o carro no registo_diario) */
    @PreAuthorize("hasAnyRole('ADMIN', 'MOTORISTA')")
    @GetMapping
    public ResponseEntity<List<CarroResponse>> listarCarros(
        @RequestParam(required = false) Boolean apenasAtivos
    ) {
        return ResponseEntity.ok(carroService.listarCarros(apenasAtivos));
    }

    /* Buscar carro pelo ID - ADMIN */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CarroResponse> listarCarroPeloId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(carroService.listarCarroPeloId(id));
    }

    /* Criar um novo carro - ADMIN */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CarroResponse> cadastrarNovoCarro(
            @Valid @RequestBody CarroRequest carroRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carroService.criarCarro(carroRequest));
    }

    /* Atualizar dados de um carro - ADMIN */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CarroResponse> atualizarCarro(
        @PathVariable Long id,
        @Valid @RequestBody CarroRequest carroRequest
    ) {
        return ResponseEntity.ok(carroService.atualizarCarroPeloId(id, carroRequest));
    }

    /* Ativar carro pelo ID */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<String> ativarCarro(
            @PathVariable Long id
    ) {
        carroService.ativarCarroPeloId(id);
        return ResponseEntity.ok("Carro com matricula:  \"" + carroService.listarCarroPeloId(id).matricula() + "\" ativado com sucesso!");
    }

    /* Ativar carro pelo ID */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<String> desativarCarro(
            @PathVariable Long id
    ) {
        carroService.desativarCarroPeloId(id);
        return ResponseEntity.ok("Carro com matricula:  \"" + carroService.listarCarroPeloId(id).matricula() + "\" desativado com sucesso!");
    }
}
