package com.leximibel.sgtp_backend.mapper;

import com.leximibel.sgtp_backend.dto.request.registo_diario.RegistoDiarioRequest;
import com.leximibel.sgtp_backend.dto.response.registo_diario.RegistoDiarioResponse;
import com.leximibel.sgtp_backend.model.RegistoDiario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RegistoDiarioMapper {

    // RegistoDiario => RegistoDiarioDTO
    public static RegistoDiarioResponse toResponseDTO(RegistoDiario registoDiario) {
        return new RegistoDiarioResponse(
                registoDiario.getId(),
                registoDiario.getCarro().getId(),
                registoDiario.getCarro().getMatricula(),
                registoDiario.getUsuario() != null ? registoDiario.getUsuario().getId() : null,
                registoDiario.getUsuario() != null ? registoDiario.getUsuario().getNome() : null,
                registoDiario.getData(),
                registoDiario.getTipoDia(),
                registoDiario.getValorEntregue(),
                registoDiario.getReceita(),
                registoDiario.getJustificativa(),
                registoDiario.getCriadoEm(),
                registoDiario.getAtualizadoEm()
        );
    }

    // List<RegistoDiario> => List<RegistoDiarioDTO>
    public static List<RegistoDiarioResponse> toResponseListDTO(List<RegistoDiario> registos) {
        return registos.stream().map(RegistoDiarioMapper::toResponseDTO).toList();
    }
}
