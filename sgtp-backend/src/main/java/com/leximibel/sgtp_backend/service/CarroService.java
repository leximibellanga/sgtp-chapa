package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.carro.CarroRequest;
import com.leximibel.sgtp_backend.dto.response.carro.CarroResponse;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.CarroMapper;
import com.leximibel.sgtp_backend.model.Carro;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CarroService {

    private CarroRepository carroRepository;

    // Metodo auxiliar para buscar carro pelo ID
    private Carro buscarCarroPeloId(Long id) {
        return carroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carro nao encontrado: " + id));
    }


    // ============ CRUD =================
    // Listar todos carros ou apenas os ativos
    public List<CarroResponse> listarCarros(Boolean apenasAtivos) {
        List<Carro> carros = (Boolean.TRUE.equals(apenasAtivos))
                ? carroRepository.findByAtivoTrue()
                : carroRepository.findAll();

        return CarroMapper.toResponseListDTO(carros);
    }


    // Buscar carro pelo ID
    public CarroResponse listarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        return CarroMapper.toResponseDTO(carro);
    }


    // Criar um novo carro
    public CarroResponse criarCarro(CarroRequest carroRequest) {
        if (carroRepository.existsByMatricula(carroRequest.matricula())) {
            throw new RegraDeNegocioException("Ja existe um carro com essa matricula");
        }

        Carro carro = new Carro();
        carro.setMatricula(carroRequest.matricula());
        carro.setModelo(carroRequest.modelo());
        carro.setAno(carroRequest.ano());
        carro.setRota(carroRequest.rota());
        carro.setAtivo(true);

        return CarroMapper.toResponseDTO(carroRepository.saveAndFlush(carro));
    }


    // Atualizar carro pelo ID
    public CarroResponse atualizarCarroPeloId(Long id, CarroRequest carroRequest) {
        Carro carro = buscarCarroPeloId(id);

        if (!carro.getMatricula().equals(carroRequest.matricula()) && carroRepository.existsByMatricula(carroRequest.matricula())) {
            throw new RegraDeNegocioException("Ja existe um carro com essa matricula");
        }

        carro.setMatricula(carroRequest.matricula());
        carro.setModelo(carroRequest.modelo());
        carro.setAno(carroRequest.ano());
        carro.setRota(carroRequest.rota());

        return CarroMapper.toResponseDTO(carroRepository.saveAndFlush(carro));
    }


    // Ativar carro
    public void ativarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        carro.setAtivo(true);
        carroRepository.saveAndFlush(carro);
    }


    // Desativar carro (Soft Delete)
    public void desativarCarroPeloId(Long id) {
        Carro carro = buscarCarroPeloId(id);
        carro.setAtivo(false);
        carroRepository.saveAndFlush(carro);
    }
}
