package com.leximibel.sgtp_backend.dto.response;

public record AuthResponse (
        String token,
        String nome,
        String email,
        String role
){}
