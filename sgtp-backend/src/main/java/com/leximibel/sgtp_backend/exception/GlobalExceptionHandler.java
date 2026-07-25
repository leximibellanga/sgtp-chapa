package com.leximibel.sgtp_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> erros = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(erro -> {
            String campo = erro.getField();
            String messagemErro = erro.getDefaultMessage();
            erros.put(campo, messagemErro);
        });

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", HttpStatus.BAD_REQUEST.value());
        resposta.put("mensagem", "Erro de validacao");
        resposta.put("erros", erros);

        return new ResponseEntity<>(resposta, HttpStatus.BAD_REQUEST);
    }

    // Credenciais Invalidas
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<Map<String, String>> handleCredenciaisInvalidas(Exception e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Email ou senha invalidos!"));
    }

    // Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
    }

    // Regras de Negocio
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<Map<String, String>> handleRegraDeNegocio(RegraDeNegocioException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
    }

    // Sem permissao
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(Exception e) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Sem permissao para aceder a este recurso"));
    }
}
