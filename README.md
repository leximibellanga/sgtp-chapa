# SGTP Chapa — Sistema de Gestão de Transporte Privado

Sistema de gestão para transporte privado ("chapa") em Moçambique, onde o dono do veículo (patrão) não é uma entidade governamental, mas sim um cidadão comum que contrata motoristas para operar o carro.

Este projeto nasceu para resolver um problema real: gerir o negócio de transporte da minha família, controlando receitas diárias, gastos operacionais e desempenho de múltiplos veículos e motoristas num único sistema.

## Sobre o negócio

- O carro trabalha 6 dias por semana (segunda a sábado).
- Segunda a sexta: o motorista entrega uma receita diária fixa ao patrão; se não atingir a meta, deve justificar.
- Sábado: o valor apurado é integralmente do motorista, não é registado no sistema.
- Domingo: dia de descanso do motorista; se o carro trabalhar excecionalmente, o valor pertence ao negócio (o próprio patrão pode conduzir).
- O sistema suporta múltiplos carros e motoristas, com registo de gastos por categoria (manutenção, combustível, documentação, outros).

## Papéis

- **Admin (patrão):** gestão total — carros, motoristas, todos os registos e gastos, relatórios agregados.
- **Motorista:** acesso limitado ao próprio dia-a-dia — regista receita diária e consulta o próprio histórico.

## Stack

**Backend**
- Java 21+ / Spring Boot
- Spring Data JPA + Hibernate
- Spring Security + JWT
- MySQL
- Flyway (migrações)
- Lombok

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- React Hook Form + Zod
- Recharts
- Tailwind CSS

## Estrutura do repositório
sgtp-chapa/
├── sgtp-backend/       # API REST (Spring Boot)
├── sgtp-frontend/      # Interface web (React)
├── docs/
│ ├── modelagem/
│ │ └── sgtp-diagrama-ER.png
└── README.md

## Documentação

- [Diagrama ER](docs/modelagem/diagrama-er.png)
- [Especificação Técnica](docs/especificacao-tecnica.pdf) — regras de negócio, papéis, endpoints da API, rotas do frontend
- [Ferramentas, Fluxo e Migrações](docs/ferramentas-fluxo-migracoes.pdf) — bibliotecas usadas, plano de trabalho e scripts de seed

## Como rodar localmente

### Pré-requisitos
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven

### Backend

```bash
cd sgtp-backend
```

Cria as variáveis de ambiente necessárias (ou configura no Run Configuration do teu IDE):
- DB_URL=jdbc:mysql://localhost:3306/sgtp_chapa?useSSL=false&createDatabaseIfNotExist=true
- DB_USERNAME=root
- DB_PASSWORD=tua_senha
- JWT_SECRET=tua_chave_secreta

```bash
mvn spring-boot:run
```

O Flyway aplica as migrações automaticamente ao subir a aplicação, incluindo dados de teste (utilizadores, carros, registos e gastos fictícios).

A API sobe em `http://localhost:8080`.

### Frontend

```bash
cd sgtp-frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Credenciais de teste (seed)

| Email              | Senha  | Role      |
|--------------------|--------|-----------|
| admin@chapa.com    | 123456 | ADMIN     |
| yamal@chapa.com    | 123456 | MOTORISTA |
| gavi@chapa.com     | 123456 | MOTORISTA |
| raphinha@chapa.com | 123456 | MOTORISTA |

> Dados de teste fictícios, sem relação com dados reais do negócio.

## Status do projeto

🚧 Em desenvolvimento — Semana 1 de 5.

## Autor

Desenvolvido por Leximibel_Langa como parte de um projeto real de gestão para o negócio da família, e como peça de portfólio.