package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.gasto.GastoRequest;
import com.leximibel.sgtp_backend.dto.response.gasto.GastoResponse;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.GastoMapper;
import com.leximibel.sgtp_backend.model.Carro;
import com.leximibel.sgtp_backend.model.Gasto;
import com.leximibel.sgtp_backend.model.Usuario;
import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.repository.GastoRepository;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class GastoService {

    private final GastoRepository gastoRepository;
    private final CarroRepository carroRepository;
    private final UsuarioRepository usuarioRepository;

    // Funcao auxiliar
    private Gasto buscarGastoPeloId(Long id) {
        return gastoRepository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Gasto não encontrado com o ID: " + id));
    }


    // ========== CRUD ============
    // Listar todos gastos
    public List<GastoResponse> listarGastos(
            Long carroId,
            CategoriaGasto categoria,
            LocalDate inicio,
            LocalDate fim
    ) {
        List<Gasto> gastos;

        if (carroId != null && inicio != null & fim !=null) {
            gastos = gastoRepository.findByCarroIdAndDataBetween(carroId, inicio, fim);
        } else if (inicio != null && fim != null) {
            gastos = gastoRepository.findByDataBetween(inicio, fim);
        } else if (carroId != null) {
            gastos = gastoRepository.findByCarroId(carroId);
        } else if (categoria != null) {
            gastos = gastoRepository.findByCategoria(categoria);
        } else {
            gastos = gastoRepository.findAll();
        }

        return gastos.stream()
                .filter(g -> categoria == null || g.getCategoria() == categoria)
                .map(GastoMapper::toResponseDTO)
                .toList();
    }

    // Listar gastos pelo ID
    public GastoResponse listarGastoPeloId(Long id) {
        Gasto gasto = buscarGastoPeloId(id);
        return GastoMapper.toResponseDTO(gasto);
    }

    // Criar um novo Gasto
    @Transactional
    public GastoResponse criarGasto(GastoRequest request, String emailUsuarioLogado) {
        Carro carro = carroRepository.findById(request.carroId())
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o ID: " + request.carroId()));

        Usuario registadoPor = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário autenticado não encontrado com o email: " + emailUsuarioLogado));

        Gasto gasto = new Gasto();
        gasto.setCarro(carro);
        gasto.setCategoria(request.categoriaGasto());
        gasto.setValor(request.valor());
        gasto.setData(request.data() != null ? request.data() : LocalDate.now());
        gasto.setDescricao(request.descricao());
        gasto.setRegistadoPor(registadoPor);

        Gasto gastoSalvo = gastoRepository.saveAndFlush(gasto);
        return GastoMapper.toResponseDTO(gastoSalvo);
    }

    // Atualizar gasto
    @Transactional
    public GastoResponse atualizarGasto(Long id, GastoRequest request) {
        Gasto gasto = buscarGastoPeloId(id);

        Carro carro = carroRepository.findById(request.carroId())
                .orElseThrow(() -> new ResourceNotFoundException("Carro não encontrado com o ID: " + request.carroId()));

        gasto.setCarro(carro);
        gasto.setCategoria(request.categoriaGasto());
        gasto.setValor(request.valor());
        gasto.setData(request.data() != null ? request.data() : LocalDate.now());
        gasto.setDescricao(request.descricao());

        Gasto gastoAtualizado = gastoRepository.saveAndFlush(gasto);
        return GastoMapper.toResponseDTO(gastoAtualizado);
    }

    // Deletar gasto
    @Transactional
    public void deletarGasto(Long id) {
        Gasto gasto = buscarGastoPeloId(id);
        gastoRepository.delete(gasto);
    }
}
