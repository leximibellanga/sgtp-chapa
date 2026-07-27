package com.leximibel.sgtp_backend.dto.request.gasto;

import com.leximibel.sgtp_backend.model.enums.CategoriaGasto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GastoRequest(
        @NotNull(message = "O Carro é obrigatório")
        Long carroId,

        @NotNull(message = "A Categoria é obrigatória")
        CategoriaGasto categoriaGasto,

        @NotNull(message = "O Valor é obrigatório")
        @PositiveOrZero(message = "O Valor deve ser maior que zero")
        BigDecimal valor,

        // Opcional: se nulo, usa a data de hoje
        LocalDate data,

        @NotBlank(message = "A Descrição é obrigatória")
        @Size(max = 255, message = "A Descrição deve ter no máximo 255 caracteres")
        String descricao
) {}
