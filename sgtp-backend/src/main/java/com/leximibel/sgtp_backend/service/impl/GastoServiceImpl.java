package com.leximibel.sgtp_backend.service.impl;

import com.leximibel.sgtp_backend.dto.request.gasto.GastoRequest;
import com.leximibel.sgtp_backend.dto.response.PaginaResponse;
import com.leximibel.sgtp_backend.dto.response.gasto.GastoResponse;
import com.leximibel.sgtp_backend.entity.Carro;
import com.leximibel.sgtp_backend.entity.Gasto;
import com.leximibel.sgtp_backend.entity.Usuario;
import com.leximibel.sgtp_backend.entity.enums.CategoriaGasto;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.GastoMapper;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.repository.GastoRepository;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import com.leximibel.sgtp_backend.service.GastoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class GastoServiceImpl implements GastoService {

    private final GastoRepository repository;
    private final CarroRepository carroRepository;
    private final UsuarioRepository usuarioRepository;

    public GastoServiceImpl(GastoRepository gastoRepository, CarroRepository carroRepository, UsuarioRepository usuarioRepository) {
        this.repository = gastoRepository;
        this.carroRepository = carroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Funcao auxiliar
    private Gasto buscarGastoPeloId(Long id) {
        return repository.findById(id).
                orElseThrow(() -> new ResourceNotFoundException("Gasto não encontrado com o ID: " + id));
    }

    /* =============================================================================================================================== */
    @Override
    public List<GastoResponse> listarGastos(Long carroId, CategoriaGasto categoria, LocalDate inicio, LocalDate fim) {
        List<Gasto> gastos;

        if (carroId != null && inicio != null & fim !=null) {
            gastos = repository.findByCarroIdAndDataBetweenOrderByDataDesc(carroId, inicio, fim);
        } else if (inicio != null && fim != null) {
            gastos = repository.findByDataBetweenOrderByDataDesc(inicio, fim);
        } else if (carroId != null) {
            gastos = repository.findByCarroIdOrderByDataDesc(carroId);
        } else if (categoria != null) {
            gastos = repository.findByCategoriaOrderByDataDesc(categoria);
        } else {
            gastos = repository.findByOrderByDataDesc();
        }

        return gastos.stream()
                .filter(g -> categoria == null || g.getCategoria() == categoria) // filtrar gastos pela categoria
                .map(GastoMapper::toResponseDTO)
                .toList();
    }

    @Override
    public GastoResponse listarGastoPeloId(Long id) {
        Gasto gasto = buscarGastoPeloId(id);
        return GastoMapper.toResponseDTO(gasto);
    }

    @Override
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

        Gasto gastoSalvo = repository.saveAndFlush(gasto);
        return GastoMapper.toResponseDTO(gastoSalvo);
    }

    @Override
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

        Gasto gastoAtualizado = repository.saveAndFlush(gasto);
        return GastoMapper.toResponseDTO(gastoAtualizado);
    }

    @Override
    @Transactional
    public void deletarGasto(Long id) {
        Gasto gasto = buscarGastoPeloId(id);
        repository.delete(gasto);
    }

    // --------------
    @Override
    public PaginaResponse<GastoResponse> listarTodos(Long carroId, CategoriaGasto categoriaGasto, int pagina, int tamanho) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        Page<Gasto> paginaGastos = repository.buscarComFiltros(carroId, categoriaGasto, pageable);

        return new PaginaResponse<>(
                GastoMapper.toResponseDTOList(paginaGastos.getContent()),
                paginaGastos.getNumber(),
                paginaGastos.getTotalPages(),
                paginaGastos.getTotalElements(),
                paginaGastos.isFirst(),
                paginaGastos.isLast()
        );
    }
}
