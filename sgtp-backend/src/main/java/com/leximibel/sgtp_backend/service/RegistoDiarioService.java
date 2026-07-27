package com.leximibel.sgtp_backend.service;

import com.leximibel.sgtp_backend.dto.request.registo_diario.RegistoDiarioRequest;
import com.leximibel.sgtp_backend.dto.response.registo_diario.RegistoDiarioResponse;
import com.leximibel.sgtp_backend.exception.RegraDeNegocioException;
import com.leximibel.sgtp_backend.exception.ResourceNotFoundException;
import com.leximibel.sgtp_backend.mapper.RegistoDiarioMapper;
import com.leximibel.sgtp_backend.model.Carro;
import com.leximibel.sgtp_backend.model.RegistoDiario;
import com.leximibel.sgtp_backend.model.Usuario;
import com.leximibel.sgtp_backend.model.enums.TipoDia;
import com.leximibel.sgtp_backend.repository.CarroRepository;
import com.leximibel.sgtp_backend.repository.RegistoDiarioRepository;
import com.leximibel.sgtp_backend.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class RegistoDiarioService {

    private static final BigDecimal RECEITA_DIARIA = new BigDecimal("2000.00");

    private RegistoDiarioRepository registoDiarioRepository;
    private CarroRepository carroRepository;
    private UsuarioRepository usuarioRepository;

    // ================= Metodos Auxiliares ===============
    // buscar registo pelo ID
    private RegistoDiario buscarRegistoPeloId (Long id) {
        return registoDiarioRepository.findById(id)
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


    // ================= CRUD ===============
    // listar todos registos
    public List<RegistoDiarioResponse> listarRegistos(Long carroId, Long usuarioId, TipoDia tipoDia) {
        List<RegistoDiario> registos = registoDiarioRepository.findAll();

        return registos.stream()
                .filter(r -> carroId == null || r.getCarro().getId().equals(carroId))
                .filter(r -> usuarioId == null || (r.getUsuario() != null && r.getUsuario().getId().equals(usuarioId)))
                .filter(r -> tipoDia == null || r.getTipoDia() == tipoDia)
                .map(RegistoDiarioMapper::toResponseDTO)
                .toList();
    }


    // Listar registos do usuario autenticado
    public List<RegistoDiarioResponse> listarMeusRegistos(String emailUsuarioLogado) {
        Usuario usuario = usuarioAutenticado(emailUsuarioLogado);
        return RegistoDiarioMapper.toResponseListDTO(registoDiarioRepository.findByUsuarioId(usuario.getId()));
    }


    // Buscar usuario pelo ID
    public RegistoDiarioResponse listarRegistoPeloId(Long id, String emailUsuarioLogado, boolean isAdmin) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        Usuario usuarioLogado = usuarioAutenticado(emailUsuarioLogado);
        validarAcessoAoRegisto(registoDiario, usuarioLogado, isAdmin);

        return RegistoDiarioMapper.toResponseDTO(registoDiario);
    }


    // criar um novo registo
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
        registoDiarioRepository.findByUsuarioIdAndData(usuarioDoRegisto.getId(), data)
                .ifPresent(r -> {
                    throw new RegraDeNegocioException("Ja existe um registo para este usuario nesta data");
                });

        RegistoDiario registoDiario = new RegistoDiario();
        registoDiario.setCarro(carro);
        registoDiario.setUsuario(usuarioDoRegisto);
        registoDiario.setData(data);
        registoDiario.setTipoDia(request.tipoDia());
        registoDiario.setValorEntregue(request.valorEntregue());

        aplicarRegrasDeNegicio(registoDiario, request);

        return RegistoDiarioMapper.toResponseDTO(registoDiarioRepository.saveAndFlush(registoDiario));
    }


    // atualizar registo pelo ID
    public RegistoDiarioResponse atualizar(Long id, RegistoDiarioRequest request, String emailUsuarioLogado, boolean isAdmin) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        Usuario usuarioLogado = usuarioAutenticado(emailUsuarioLogado);

        validarAcessoAoRegisto(registoDiario, usuarioLogado, isAdmin);

        // Motorista so pode editar registo do mesmo dia que foi criado
        if (!isAdmin && !registoDiario.getData().equals(LocalDate.now())) {
            throw new RegraDeNegocioException("So e possivel editar o registo no mesmo dia da criacao");
        }

        registoDiario.setValorEntregue(request.valorEntregue());
        aplicarRegrasDeNegicio(registoDiario, request);

        return RegistoDiarioMapper.toResponseDTO(registoDiarioRepository.saveAndFlush(registoDiario));
    }


    // Remover registo
    @Transactional
    public void deletarRegisto(Long id) {
        RegistoDiario registoDiario = buscarRegistoPeloId(id);
        registoDiarioRepository.delete(registoDiario);
    }


    // ============== Regras de negocio ===========
    private void aplicarRegrasDeNegicio(RegistoDiario registoDiario, RegistoDiarioRequest request) {
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
}
