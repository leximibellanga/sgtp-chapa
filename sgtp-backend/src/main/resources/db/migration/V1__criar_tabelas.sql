-- BASE DE DADOS: sgtp_chapa

-- tabela de usuarios
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(9) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,    /* Rever esse ENUM antes de rodar*/
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabela de carros
CREATE TABLE carros (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(80) NOT NULL,
    ano INT NOT NULL,
    rota VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,    /* Rever esse ENUM antes de rodar*/
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabela de registos diarios
CREATE TABLE registos_diarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    carro_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    data DATE NOT NULL,
    tipo_dia ENUM('UTIL', 'DOMINGO') NOT NULL DEFAULT 'UTIL',
    valor_entregue DECIMAL(10, 2) NOT NULL,
    receita DECIMAL(10, 2),
    justificativa VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registo_carro FOREIGN KEY (carro_id) REFERENCES carros(id),
    CONSTRAINT fk_registo_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- tabela de gastos
CREATE TABLE gastos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    carro_id BIGINT NOT NULL,
    categoria ENUM('MANUTENCAO', 'COMBUSTIVEL', 'DOCUMENTACAO', 'OUTROS') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    registado_por_id BIGINT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_gasto_carro FOREIGN KEY (carro_id) REFERENCES carros(id),
    CONSTRAINT fk_gasto_usuario FOREIGN KEY (registado_por_id) REFERENCES usuarios(id)
);
