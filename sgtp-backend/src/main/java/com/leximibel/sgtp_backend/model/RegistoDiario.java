package com.leximibel.sgtp_backend.model;

import com.leximibel.sgtp_backend.model.enums.TipoDia;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "registos_diarios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegistoDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // evita carregar Carro inteiro sempre que busca-se um Registo_Diario. Carrega so quando eh necessario/preciso
    @JoinColumn(name = "carro_id", nullable = false)
    private Carro carro;

    @ManyToOne(fetch = FetchType.LAZY) // evita carregar Usuario inteiro sempre que busca-se um Registo_Diario. Carrega so quando eh necessario/preciso
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_dia", nullable = false, length = 25)
    private TipoDia tipoDia;

    @Column(name = "valor_entregue", nullable = true, precision = 10, scale = 2)
    private BigDecimal valorEntregue;

    @Column(nullable = true, precision = 10, scale = 2) // precision e scale -> Para gerar o metodo do MySQL: DECIMAL(10, 2)
    private BigDecimal receita;

    @Column(nullable = true, length = 255)
    private String justificativa;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;


    @PrePersist
    protected void aoCriar() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void aoAtualizar() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
