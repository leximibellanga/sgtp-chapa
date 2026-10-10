package com.leximibel.sgtp_backend.service.impl;

import com.leximibel.sgtp_backend.dto.request.registo_diario.RegistoDiarioRequest;
import com.leximibel.sgtp_backend.dto.response.PaginaResponse;
import com.leximibel.sgtp_backend.dto.response.registo_diario.RegistoDiarioResponse;
import com.leximibel.sgtp_backend.entity.Carro;
import com.leximibel.sgtp_backend.entity.RegistoDiario;
import com.leximibel.sgtp_backend.entity.Usuario;
import com.leximibel.sgtp_backend.entity.enums.TipoDia;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.RegistoDiarioMapper;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.repository.RegistoDiarioRepository;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import com.leximibel.sgtp_backend.service.RegistoDiarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RegistoDiarioServiceImpl implements RegistoDiarioService {

    private static final BigDecimal RECEITA_DIARIA = new BigDecimal("2000.00");

    private final RegistoDiarioRepository repository;
    private final CarroRepository carroRepository;
    private final UsuarioRepository usuarioRepository;

    // injectar via construtor
    public RegistoDiarioServiceImpl(RegistoDiarioRepository repository, CarroRepository carroRepository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.carroRepository = carroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // ================= Metodos Auxiliares ===============
    // buscar registo pelo ID
    private RegistoDiario buscarRegistoPeloId (Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registo nao encontrado: " + id));
    }

    // pegar usuario autenticado pelo email
    private Usuario usuarioAutenticado(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado nao encontrado"));
    }

    // Confirma que o usuario autenticado pode ver/editar este registo
    private void validarAcessoAoRegisto(RegistoDiario registoDiario, Usuario usuarioLogado, boolean isAdmin) {
        if (isAdmin) return;
        boolean isDono = registoDiario.getUsuario() != null && registoDiario.getUsuario().getId().equals(usuarioLogado.getId());
        if (!isDono) {
            throw new AccessDeniedException("Sem permissao para aceder a este registo");
        }
    }

    /* ======================================================================================================================= */
    @Override
    public List<RegistoDiarioResponse> listarRegistos(Long carroId, Long usuarioId, TipoDia tipoDia) {
        List<RegistoDiario> registos = repository.findByOrderByDataDesc();

        return registos.stream()
                // com filtro de carro
                .filter(r -> carroId == null || r.getCarro().getId().equals(carroId))
                // com filtro de usuario
                .filter(r -> usuarioId == null || (r.getUsuario() != null && r.getUsuario().getId().equals(usuarioId)))
                // com filtro de tipo_dia
                .filter(r -> tipoDia == null || r.getTipoDia() == tipoDia)
                .map(RegistoDiarioMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<RegistoDiarioResponse> listarMeusRegistos(String emailUsuarioLogado) {
        Usuario usuario = usuarioAutenticado(emailUsuarioLogado);
        return RegistoDiarioMapper.toResponseListDTO(repository.findByUsuarioId(usuario.getId()));
    }

    @Override
    public RegistoDiarioResponse listarRegistoPeloId(Long id, String emailUsuarioLogado, boolean isAdmin) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        Usuario usuarioLogado = usuarioAutenticado(emailUsuarioLogado);
        validarAcessoAoRegisto(registoDiario, usuarioLogado, isAdmin);

        return RegistoDiarioMapper.toResponseDTO(registoDiario);
    }

    @Override
    @Transactional
    public RegistoDiarioResponse criarNovoRegisto(RegistoDiarioRequest request, String emailUsuarioLogado, boolean isAdmin) {
        Usuario usuarioLogado = usuarioAutenticado(emailUsuarioLogado);

        Carro carro = carroRepository.findById(request.carroId())
                .orElseThrow(() -> new ResourceNotFoundException("Carro nao encontrado: " + request.carroId()));

        // Motorista so pode criar registo para si mesmo, mesmo que tente mandar outro usuarioId
        Usuario usuarioDoRegisto = usuarioLogado;
        if (isAdmin && request.usuarioId() != null) {
            usuarioDoRegisto = usuarioRepository.findById(request.usuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado: " + request.usuarioId()));
        }

        LocalDate data = (request.data() != null) ? request.data() : LocalDate.now();

        // Impede 2 registos do mesmo usuario no mesmo dia
        repository.findByUsuarioIdAndData(usuarioDoRegisto.getId(), data)
                .ifPresent(r -> {
                    throw new RegraDeNegocioException("Ja existe um registo para este usuario nesta data");
                });

        RegistoDiario registoDiario = new RegistoDiario();
        registoDiario.setCarro(carro);
        registoDiario.setUsuario(usuarioDoRegisto);
        registoDiario.setData(data);
        registoDiario.setTipoDia(request.tipoDia());
        registoDiario.setValorEntregue(request.valorEntregue());

        aplicarRegrasDeNegocio(registoDiario, request);

        return RegistoDiarioMapper.toResponseDTO(repository.saveAndFlush(registoDiario));
    }

    @Override
    @Transactional
    public RegistoDiarioResponse atualizar(Long id, RegistoDiarioRequest request, String emailUsuarioLogado, boolean isAdmin) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        Usuario usuarioLogado = usuarioAutenticado(emailUsuarioLogado);

        validarAcessoAoRegisto(registoDiario, usuarioLogado, isAdmin);

        // Motorista so pode editar registo do mesmo dia que foi criado
        if (!isAdmin && !registoDiario.getData().equals(LocalDate.now())) {
            throw new RegraDeNegocioException("So e possivel editar o registo no mesmo dia da criacao");
        }

        registoDiario.setValorEntregue(request.valorEntregue());
        aplicarRegrasDeNegocio(registoDiario, request);

        return RegistoDiarioMapper.toResponseDTO(repository.saveAndFlush(registoDiario));
    }

    @Override
    @Transactional
    public void deletarRegisto(Long id) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        repository.delete(registoDiario);
    }

    // -------------
    @Override
    public PaginaResponse<RegistoDiarioResponse> listarTodos(Long carroId, Long usuarioId, TipoDia tipoDia, int pagina, int tamanho) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        Page<RegistoDiario> paginaRegistos =
                repository.buscarComFiltros(carroId, usuarioId, tipoDia, pageable);

        return toPaginaResponse(paginaRegistos);
    }

    @Override
    public PaginaResponse<RegistoDiarioResponse> listarMeusRegistos(String emailUsuarioLogado, int pagina, int tamanho) {
        Usuario usuario = usuarioAutenticado(emailUsuarioLogado);
        Pageable pageable = PageRequest.of(pagina, tamanho);
        Page<RegistoDiario> paginaRegistos = repository.buscarPorUsuario(usuario.getId(), pageable);

        return toPaginaResponse(paginaRegistos);
    }

    // ============== Regras de negocio ===========
    private void aplicarRegrasDeNegocio(RegistoDiario registoDiario, RegistoDiarioRequest request) {
        if (request.tipoDia() == TipoDia.UTIL) {
            registoDiario.setReceita(RECEITA_DIARIA);

            boolean atingiuMeta = request.valorEntregue().compareTo(RECEITA_DIARIA) >= 0;

            if (!atingiuMeta && (request.justificativa() == null || request.justificativa().isBlank())) {
                throw new RegraDeNegocioException("Justificativa e obrigatoria quando o valor entregue e menor que a receita diaria");
            }

            registoDiario.setJustificativa(atingiuMeta ? null : request.justificativa());
        } else if (request.tipoDia() == TipoDia.DOMINGO) {
            // domingo nao tem receita diaria e nem justificativa
            registoDiario.setReceita(null);
            registoDiario.setJustificativa(null);
        }
    }

    private PaginaResponse<RegistoDiarioResponse> toPaginaResponse(Page<RegistoDiario> pagina) {
        return new PaginaResponse<>(
                RegistoDiarioMapper.toResponseListDTO(pagina.getContent()),
                pagina.getNumber(),
                pagina.getTotalPages(),
                pagina.getTotalElements(),
                pagina.isFirst(),
                pagina.isLast()
        );
    }
}
