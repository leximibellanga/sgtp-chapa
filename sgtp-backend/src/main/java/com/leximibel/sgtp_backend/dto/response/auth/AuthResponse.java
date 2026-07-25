package com.leximibel.sgtp_backend.dto.response.auth;

public record AuthResponse (
        String token,
        String nome,
        String email,
        String role
){}
