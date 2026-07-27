package com.leximibel.sgtp_backend.mapper;

import com.leximibel.sgtp_backend.dto.response.gasto.GastoResponse;
import com.leximibel.sgtp_backend.model.Gasto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GastoMapper {

    // Gasto => GastoDTO
    public static GastoResponse toResponseDTO(Gasto gasto) {
        return new GastoResponse(
                gasto.getId(),
                gasto.getCarro().getId(),
                gasto.getCarro().getMatricula(),
                gasto.getCategoria(),
                gasto.getValor(),
                gasto.getData(),
                gasto.getDescricao(),
                gasto.getRegistadoPor().getId(),
                gasto.getRegistadoPor().getNome(),
                gasto.getCriadoEm()
        );
    }

    // List<Gasto> => List<GastoDTO>
    public static List<GastoResponse> toResponseDTOList(List<Gasto> gastos) {
        return gastos.stream()
                .map(GastoMapper::toResponseDTO)
                .toList();
    }
}
