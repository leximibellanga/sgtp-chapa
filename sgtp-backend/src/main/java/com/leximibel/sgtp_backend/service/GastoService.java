package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.gasto.GastoRequest;
import com.leximibel.sgtp_backend.dto.response.gasto.GastoResponse;
import com.leximibel.sgtp_backend.entity.enums.CategoriaGasto;

import java.time.LocalDate;
import java.util.List;

public interface GastoService {

    // listar todos gastos | filtros: carro, categoria, data (inicio - fim)
    public List<GastoResponse> listarGastos(Long carroId, CategoriaGasto categoria, LocalDate inicio, LocalDate fim);

    // buscar gasto pelo ID
    public GastoResponse listarGastoPeloId(Long id);

    // cadastrar um novo gasto
    public GastoResponse criarGasto(GastoRequest request, String emailUsuarioLogado);

    // atualizar um gasto existente pelo id
    public GastoResponse atualizarGasto(Long id, GastoRequest request);

    // apagar um gasto pelo id
    public void deletarGasto(Long id);
}
