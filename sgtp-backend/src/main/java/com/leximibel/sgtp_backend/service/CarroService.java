package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.carro.CarroRequest;
import com.leximibel.sgtp_backend.dto.response.carro.CarroResponse;

import java.util.List;

public interface CarroService {
    // listar todos
    public List<CarroResponse> listarCarros(Boolean apenasAtivos);

    // lista pelo id
    public CarroResponse listarCarroPeloId(Long id);

    // criar
    public CarroResponse criarCarro(CarroRequest carroRequest);

    // atualizar - update
    public CarroResponse atualizarCarroPeloId(Long id, CarroRequest carroRequest);

    // ativar
    public void ativarCarroPeloId(Long id);

    // desativar
    public void desativarCarroPeloId(Long id);
}
