package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.registo_diario.RegistoDiarioRequest;
import com.leximibel.sgtp_backend.dto.response.PaginaResponse;
import com.leximibel.sgtp_backend.dto.response.registo_diario.RegistoDiarioResponse;
import com.leximibel.sgtp_backend.entity.enums.TipoDia;

import java.util.List;

public interface RegistoDiarioService {

    // listar todods registos
    public List<RegistoDiarioResponse> listarRegistos(Long carroId, Long usuarioId, TipoDia tipoDia);

    // listar registos do usuario autenticado
    public List<RegistoDiarioResponse> listarMeusRegistos(String emailUsuarioLogado);

    // Buscar usuario pelo ID
    public RegistoDiarioResponse listarRegistoPeloId(Long id, String emailUsuarioLogado, boolean isAdmin);

    // criar um novo registo
    public RegistoDiarioResponse criarNovoRegisto(RegistoDiarioRequest request, String emailUsuarioLogado, boolean isAdmin);

    // atualizar registo pelo ID
    public RegistoDiarioResponse atualizar(Long id, RegistoDiarioRequest request, String emailUsuarioLogado, boolean isAdmin);

    // Eliminar registo
    public void deletarRegisto(Long id);

    // -----------
    PaginaResponse<RegistoDiarioResponse> listarTodos(Long carroId, Long usuarioId, TipoDia tipoDia, int pagina, int tamanho);

    PaginaResponse<RegistoDiarioResponse> listarMeusRegistos(String emailUsuarioLogado, int pagina, int tamanho);
}
