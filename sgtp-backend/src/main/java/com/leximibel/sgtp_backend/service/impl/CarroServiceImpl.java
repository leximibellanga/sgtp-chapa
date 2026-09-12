package com.leximibel.sgtp_backend.service.impl;

import com.leximibel.sgtp_backend.dto.request.carro.CarroRequest;
import com.leximibel.sgtp_backend.dto.response.carro.CarroResponse;
import com.leximibel.sgtp_backend.entity.Carro;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.CarroMapper;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.service.CarroService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CarroServiceImpl implements CarroService {

    private final CarroRepository repository;

    // injectar via construtor
    public CarroServiceImpl(CarroRepository repository) {
        this.repository = repository;
    }

    // Metodo auxiliar para buscar carro pelo ID
    private Carro buscarCarroPeloId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro nao encontrado: " + id));
    }

    /* ======================================================================================================================= */
    @Override
    public List<CarroResponse> listarCarros(Boolean apenasAtivos) {
        List<Carro> carros = (Boolean.TRUE.equals(apenasAtivos))
                ? repository.findByAtivoTrue()
                : repository.findAll();

        return CarroMapper.toResponseListDTO(carros);
    }

    @Override
    public CarroResponse listarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        return CarroMapper.toResponseDTO(carro);
    }

    @Override
    @Transactional
    public CarroResponse criarCarro(CarroRequest carroRequest) {
        if (repository.existsByMatricula(carroRequest.matricula())) {
            throw new RegraDeNegocioException("Ja existe um carro com essa matricula");
        }

        Carro carro = new Carro();
        carro.setMatricula(carroRequest.matricula());
        carro.setModelo(carroRequest.modelo());
        carro.setAno(carroRequest.ano());
        carro.setRota(carroRequest.rota());
        carro.setAtivo(true);

        return CarroMapper.toResponseDTO(repository.saveAndFlush(carro));
    }

    @Override
    @Transactional
    public CarroResponse atualizarCarroPeloId(Long id, CarroRequest carroRequest) {
        Carro carro = buscarCarroPeloId(id);

        if (!carro.getMatricula().equals(carroRequest.matricula()) && repository.existsByMatricula(carroRequest.matricula())) {
            throw new RegraDeNegocioException("Ja existe um carro com essa matricula");
        }

        carro.setMatricula(carroRequest.matricula());
        carro.setModelo(carroRequest.modelo());
        carro.setAno(carroRequest.ano());
        carro.setRota(carroRequest.rota());

        return CarroMapper.toResponseDTO(repository.saveAndFlush(carro));
    }

    @Override
    @Transactional
    public void ativarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        carro.setAtivo(true);
        repository.saveAndFlush(carro);
    }

    @Override
    @Transactional
    public void desativarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        carro.setAtivo(false);
        repository.saveAndFlush(carro);
    }
}
