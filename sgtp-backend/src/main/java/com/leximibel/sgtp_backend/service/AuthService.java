package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.auth.LoginRequest;
import com.leximibel.sgtp_backend.dto.response.auth.AuthResponse;

public interface AuthService {
    // login
    public AuthResponse login(LoginRequest request);

}


