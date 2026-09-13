package com.leximibel.sgtp_backend.service.impl;

import com.leximibel.sgtp_backend.dto.request.auth.LoginRequest;
import com.leximibel.sgtp_backend.dto.response.auth.AuthResponse;
import com.leximibel.sgtp_backend.entity.Usuario;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import com.leximibel.sgtp_backend.security.JwtService;
import com.leximibel.sgtp_backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    // injectar via construtor
    public AuthServiceImpl(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // autenticar usuario atraves do email+senha
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        // procurar o usuario que fez a autenticacao
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuario nao encontrado apos a autenticacao"));

        // pegar todas as informacoes necessarias para gerar token
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities("ROLE_" + usuario.getRole().name())
                .build();

        // gerar token
        String token = jwtService.gerarToken(userDetails);

        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getRole().name());
    }
}
