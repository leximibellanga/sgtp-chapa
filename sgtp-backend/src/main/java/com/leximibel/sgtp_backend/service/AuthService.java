package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.LoginRequest;
import com.leximibel.sgtp_backend.dto.response.AuthResponse;
import com.leximibel.sgtp_backend.model.Usuario;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import com.leximibel.sgtp_backend.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuario nao encontrado apos autenticacao"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities("ROLE_" + usuario.getRole().name())
                .build();

        String token = jwtService.gerarToken(userDetails);

        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getRole().name());
    }
}

