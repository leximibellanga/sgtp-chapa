package com.leximibel.sgtp_backend.model;

import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "gastos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // evita carregar Carro inteiro sempre que busca-se um Gasto. Carrega so quando eh necessario/preciso
    @JoinColumn(name = "carro_id", nullable = false)
    private Carro carro;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = false, length = 30)
    private CategoriaGasto categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = true)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY) // evita carregar Usuario inteiro sempre que busca-se um Gasto. Carrega so quando eh necessario/preciso
    @JoinColumn(name = "registado_por_id", nullable = false)
    private Usuario registadoPor;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;


    @PrePersist
    protected void aoCriar() {
        this.criadoEm = LocalDateTime.now();
    }
}
