package com.leximibel.sgtp_backend.controller;

import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioRequest;
import com.leximibel.sgtp_backend.dto.request.usuarios.UsuarioUpdateRequest;
import com.leximibel.sgtp_backend.dto.response.usuarios.UsuarioResponse;
import com.leximibel.sgtp_backend.model.enums.Role;
import com.leximibel.sgtp_backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
// Dar autorizacao ao ADMIN para ter acesso aos usuarios
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    /* Listar usuarios */
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios(
        @RequestParam(required = false) Role role
    ) {
        return ResponseEntity.ok(usuarioService.listarUsuarios(role));
    }


    /* Listar usuario pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> listarUsuarioPeloId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(usuarioService.listarUsuarioPeloId(id));
    }


    /* Criar um novo usuario */
    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrarNovoUsuario(
            @Valid @RequestBody UsuarioRequest usuarioRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criarUsuario(usuarioRequest));
    }


    /* Atualizar dados de usuario pelo ID */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuarioPeloId(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest usuarioUpdateRequest
    ) {
        return ResponseEntity.ok(usuarioService.atualizarUsuarioPeloId(id, usuarioUpdateRequest));
    }


    /* Desativar usuario pelo ID (Soft Delete) */
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<String> desativarUsuarioPeloId(
            @PathVariable Long id
    ) {
        usuarioService.desativarUsuarioPeloId(id);
        return ResponseEntity.ok( "\"" + usuarioService.listarUsuarioPeloId(id).nome() + "\" desativado com sucesso!");
    }


    /* Ativar usuario pelo ID */
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<String> ativarUsuarioPeloId(
            @PathVariable Long id
    ) {
        usuarioService.ativarUsuarioPeloId(id);
        return ResponseEntity.ok("\"" + usuarioService.listarUsuarioPeloId(id).nome() + "\" ativado com sucesso!");
    }
}
