package com.leximibel.sgtp_backend.mapper;

import com.leximibel.sgtp_backend.dto.response.carro.CarroResponse;
import com.leximibel.sgtp_backend.model.Carro;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CarroMapper {

    // Transformar: Carro -> CarroResponse
    public static CarroResponse toResponseDTO(Carro carro) {
        return new CarroResponse(
                carro.getId(),
                carro.getMatricula(),
                carro.getModelo(),
                carro.getAno(),
                carro.getRota(),
                carro.isAtivo(),
                carro.getCriadoEm()
        );
    }

    // Transformar: List<Carro> -> List<CarroResponse>
    public static List<CarroResponse> toResponseListDTO(List<Carro> carros) {
        return carros.stream().map(CarroMapper::toResponseDTO).toList();
    }
}
