-- ============= USUARIOS ===================
-- Senha: 123456, para todos usuarios
INSERT INTO usuarios (nome, email, telefone, senha, role, ativo, criado_em) VALUES
('Admin', 'admin@chapa.com', 820000001, '$2b$10$iaXcZTbQ8pwsnl6rRefUa.Yr.Oh/mpkXqSrTelgMI5bXq/rjw/kRK', 'ADMIN', true, NOW()),
('Yamal Motorista', 'yamal@chapa.com', 820000002, '$2b$10$iaXcZTbQ8pwsnl6rRefUa.Yr.Oh/mpkXqSrTelgMI5bXq/rjw/kRK', 'MOTORISTA', true, NOW()),
('Gavi Motorista', 'gavi@chapa.com', 820000003, '$2b$10$iaXcZTbQ8pwsnl6rRefUa.Yr.Oh/mpkXqSrTelgMI5bXq/rjw/kRK', 'MOTORISTA', true, NOW()),
('Raphinha Motorista', 'raphinha@chapa.com', 820000004, '$2b$10$iaXcZTbQ8pwsnl6rRefUa.Yr.Oh/mpkXqSrTelgMI5bXq/rjw/kRK', 'MOTORISTA', true, NOW());

-- ============= CARROS ===================
INSERT INTO carros (matricula, modelo, ano, rota, ativo, criado_em) VALUES
    ('AAB-123-MC', 'Toyota Hiace', 2015, 'T3 - Baixa', true, NOW()),
    ('AAC-456-MC', 'Toyota Hiace (Quantum)', 2017, 'T3 - Muhalaze', true, NOW()),
    ('AAD-789-MC', 'Nissan Caravan', 2021, 'Nkobe - Zimpeto', true, NOW());

-- ============= REGISTOS_DIARIO ===================
INSERT INTO registos_diarios (carro_id, usuario_id, data, tipo_dia, valor_entregue, receita, justificativa, criado_em, atualizado_em) VALUES
(1, 2, '2026-07-18', 'UTIL', 2500.00, 2500.00, NULL, NOW(), NOW()),     -- Dia UTIL com receita alcancada
(1, 2, '2026-07-19', 'UTIL', 1800.00, 2500.00, 'Transito intenso e chuva durante a tarde.', NOW(), NOW()),  -- Dia UTIL com receita nao alcancada
(2, 3, '2026-07-18', 'UTIL', 2800.00, 2500.00, NULL, NOW(), NOW()),     -- Dia UTIL com receita alcancada + 300
(3, 4, '2026-07-19', 'UTIL', 2500.00, 2500.00, NULL, NOW(), NOW()),     -- Dia UTIL com receita alcancada
(1, 1, '2026-07-20', 'DOMINGO', 3500.00, NULL, NULL, NOW(), NOW());     -- Domingo trabalhado pelo proprio dono do transporte

-- ============= GASTOS ===================
INSERT INTO gastos (carro_id, categoria, valor, data, descricao, registado_por_id, criado_em) VALUES
(1, 'COMBUSTIVEL', 1500, '2026-07-15', 'Abastecimento semanal', 1, NOW()),
(1, 'MANUTENCAO', 3200, '2026-07-17', 'Troca de oleo e filtros', 1, NOW()),
(2, 'DOCUMENTACAO', 800, '2026-07-15', 'Renovacao de seguros', 1, NOW()),
(2, 'COMBUSTIVEL', 1400, '2026-07-13', 'Abastecimento semanal', 1, NOW()),
(3, 'OUTROS', 500, '2026-07-15', 'Lavagem e limpeza interior', 1, NOW()),
(3, 'MANUTENCAO', 2100, '2026-07-14', 'Reparacao do sistema de travagem', 1, NOW());

