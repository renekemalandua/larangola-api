# 🏠 LarAngola API

[![Node.js](https://img.shields.io/badge/Node.js-22.21.1-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![SonarCloud](https://img.shields.io/badge/SonarCloud-Enabled-4E9BCD?style=flat-square&logo=sonarcloud&logoColor=white)](https://sonarcloud.io/)

> API RESTful desenvolvida com NestJS para o ecossistema LarAngola - plataforma de gestão imobiliária e busca de propriedades em Angola.

## 📋 Sobre o Projeto

A **LarAngola API** é uma API backend robusta e escalável construída com **NestJS**, seguindo os princípios de **Clean Architecture** e **Hexagonal Architecture**. Esta API serve como backend para aplicações mobile e web do ecossistema LarAngola, fornecendo endpoints para gestão de propriedades, usuários, agentes imobiliários, visitas agendadas, negócios fechados e muito mais.

### Objetivos

- ✅ Fornecer uma API RESTful completa e documentada
- ✅ Implementar arquitetura limpa e testável
- ✅ Garantir qualidade de código através de CI/CD
- ✅ Facilitar deploy e escalabilidade com Docker
- ✅ Manter padrões de desenvolvimento profissional

## 🏗️ Tecnologias e Arquitetura

### Stack Tecnológico

- **Runtime**: Node.js 22.21.1
- **Framework**: NestJS 11.0.1
- **Linguagem**: TypeScript 5.9.3
- **ORM**: Prisma 6.15.0
- **Banco de Dados**: PostgreSQL 16
- **Containerização**: Docker & Docker Compose
- **Documentação**: Swagger/OpenAPI
- **Autenticação**: JWT (Passport)
- **Validação**: class-validator & class-transformer

### Arquitetura

Este projeto segue os princípios de **Clean Architecture** e **Hexagonal Architecture**, organizando o código em camadas bem definidas:

```
src/
├── entities/          # Modelos de domínio com lógica de negócio
├── repositories/      # Abstração de acesso a dados (interfaces + Prisma)
├── usecases/         # Lógica de negócio da aplicação
├── controllers/       # Endpoints HTTP
├── adapters/         # Transformação de dados entre camadas
├── dto/              # Data Transfer Objects para requests/responses
└── shared/           # Utilitários, filtros e serviços compartilhados
```

### DevOps e Qualidade

- **Docker**: Containerização multi-stage para otimização
- **Docker Compose**: Orquestração de serviços (API + PostgreSQL)
- **Git Flow**: Workflow manual com branches protegidas
- **CI/CD**: Integração contínua com GitHub Actions
- **SonarCloud**: Análise estática de código e qualidade
- **Linting**: ESLint com configuração Prettier
- **Type Checking**: TypeScript strict mode

## 🚀 Setup Local com Docker

### Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Configuração Inicial

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd LarAngola/api
```

2. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

3. **Inicie os serviços com Docker Compose**:
```bash
docker-compose up -d
```

Este comando irá:
- ✅ Construir a imagem Docker da API
- ✅ Iniciar o container PostgreSQL
- ✅ Executar migrações do Prisma
- ✅ Iniciar a API na porta `8000`

4. **Verifique os logs**:
```bash
docker-compose logs -f backend
```

5. **Acesse a documentação Swagger**:
```
http://localhost:8000/api/doc
```

### Comandos Docker Úteis

```bash
# Parar os serviços
docker-compose down

# Parar e remover volumes (limpar dados)
docker-compose down -v

# Reconstruir a imagem
docker-compose build --no-cache

# Ver status dos containers
docker-compose ps

# Executar comandos no container
docker-compose exec backend npm run lint
```

### Build e Push da Imagem Docker

```bash
# Build da imagem
docker build -t renekemalandua/larangola-nest-api:latest .

# Tag para versão específica
docker tag renekemalandua/larangola-nest-api:latest renekemalandua/larangola-nest-api:v1.0.0

# Push para Docker Hub
docker push renekemalandua/larangola-nest-api:latest
docker push renekemalandua/larangola-nest-api:v1.0.0
```

## 🔀 Fluxo de Git

Este projeto utiliza um **Git Flow manual** com branches protegidas e políticas rigorosas de merge.

### Estrutura de Branches

- **`main`**: Branch de produção - código estável e testado
- **`develop`**: Branch padrão (default) - integração de features
- **`feature/*`**: Novas funcionalidades
- **`bugfix/*`**: Correções de bugs
- **`release/*`**: Preparação de releases

### Regras de Workflow

1. **Branch Protection**:
   - `main` e `develop` são protegidas
   - Merges diretos são bloqueados
   - Pull Requests obrigatórios

2. **Pull Requests**:
   - PRs devem ser aprovados por pelo menos 1 revisor
   - CI deve passar com sucesso antes do merge
   - Branches são deletadas automaticamente após merge

3. **Padrão de Nomenclatura**:
   ```bash
   feature/nome-da-feature
   bugfix/descricao-do-bug
   release/v1.0.0
   ```

4. **Workflow Manual**:
   ```bash
   # Criar feature branch
   git checkout develop
   git pull origin develop
   git checkout -b feature/nova-funcionalidade

   # Desenvolver e commitar
   git add .
   git commit -m "feat: adiciona nova funcionalidade"

   # Push e criar PR
   git push origin feature/nova-funcionalidade
   # Criar PR no GitHub: feature/nova-funcionalidade -> develop
   ```

## 🔄 Pipeline de CI

O pipeline de CI é executado automaticamente via **GitHub Actions** em push e Pull Requests nas branches `develop` e `main`.

### Triggers

- ✅ Push em `develop` ou `main`
- ✅ Pull Requests para `develop` ou `main`

### Etapas do Pipeline

1. **Checkout do código**
2. **Setup Node.js 22.21.1**
3. **Instalação de dependências** (`npm ci`)
4. **Verificações de qualidade**:
   - ✅ **Lint**: `npm run lint` (ESLint)
   - ✅ **Format**: `npm run format:check` (Prettier)
   - ✅ **Type Check**: `npm run tsc` (TypeScript)
5. **Análise SonarCloud**:
   - Análise estática de código
   - Cobertura de testes
   - Detecção de code smells e vulnerabilidades
6. **Build**: `npm run build`

### Controle de Versão e Rollback

- Versões são controladas via tags Git
- Rollback pode ser feito revertendo commits ou deployando versões anteriores
- Imagens Docker são versionadas para facilitar rollback

### Status do CI

O status do CI é exibido nos badges do README e deve estar verde antes de qualquer merge.

## 📚 Exemplos de Uso da API

### Base URL

```
http://localhost:8000/api/v1
```

### Autenticação

A maioria dos endpoints requer autenticação via JWT Bearer Token:

```bash
Authorization: Bearer <seu-token-jwt>
```

### Endpoints Principais

#### 1. Usuários

**Criar Usuário**
```http
POST /api/v1/users/create
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "+244912345678"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+244912345678",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Listar Usuários**
```http
GET /api/v1/users/list
```

**Buscar Usuário por ID**
```http
GET /api/v1/users/:id
```

**Atualizar Usuário**
```http
PUT /api/v1/users/:id
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "+244912345679"
}
```

**Deletar Usuário**
```http
DELETE /api/v1/users/:id
```

#### 2. Propriedades

**Criar Propriedade**
```http
POST /api/v1/properties/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Apartamento T3 em Luanda",
  "description": "Apartamento moderno com 3 quartos",
  "price": 150000,
  "address": "Rua da Maianga, Luanda",
  "categoryId": "uuid-category",
  "ownerId": "uuid-owner"
}
```

**Listar Propriedades**
```http
GET /api/v1/properties/list
```

**Buscar Propriedade por ID**
```http
GET /api/v1/properties/:id
```

**Listar Propriedades por Proprietário**
```http
GET /api/v1/properties/owner/:ownerId
```

**Listar Propriedades por Categoria**
```http
GET /api/v1/properties/category/:categoryId
```

#### 3. Outros Recursos

A API também fornece endpoints para:
- **Agentes** (`/api/v1/agents`)
- **Propriedades de Interesse** (`/api/v1/property-interests`)
- **Visitas Agendadas** (`/api/v1/scheduled-visits`)
- **Negócios Fechados** (`/api/v1/closed-deals`)
- **Chats e Mensagens** (`/api/v1/chats`, `/api/v1/messages`)
- **Avaliações** (`/api/v1/reviews`)
- **Categorias de Propriedades** (`/api/v1/property-categories`)

### Documentação Interativa

Acesse a documentação Swagger completa em:
```
http://localhost:8000/api/doc
```

A documentação inclui:
- ✅ Descrição de todos os endpoints
- ✅ Schemas de request/response
- ✅ Teste interativo de endpoints
- ✅ Autenticação Bearer Token

## 🤝 Como Contribuir

Contribuições são bem-vindas! Este projeto segue um workflow rigoroso para garantir qualidade e consistência.

### Processo de Contribuição

1. **Fork o repositório** (se aplicável)

2. **Crie uma branch a partir de `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/sua-feature
   # ou
   git checkout -b bugfix/correcao-bug
   ```

3. **Desenvolva sua feature/correção**:
   - Siga os padrões de código do projeto
   - Escreva código limpo e testável
   - Adicione documentação quando necessário

4. **Execute verificações locais**:
   ```bash
   npm run lint
   npm run format:check
   npm run tsc
   npm run build
   ```

5. **Commit suas mudanças**:
   ```bash
   git add .
   git commit -m "feat: descrição da feature"
   # ou
   git commit -m "fix: descrição da correção"
   ```

   **Convenção de Commits**:
   - `feat:` Nova funcionalidade
   - `fix:` Correção de bug
   - `docs:` Documentação
   - `style:` Formatação
   - `refactor:` Refatoração
   - `test:` Testes
   - `chore:` Manutenção

6. **Push e crie um Pull Request**:
   ```bash
   git push origin feature/sua-feature
   ```

   - Crie o PR no GitHub: `feature/sua-feature` → `develop`
   - Descreva claramente as mudanças
   - Aguarde a aprovação do CI e revisores

7. **Após aprovação**:
   - O PR será mergeado
   - A branch será deletada automaticamente

### Padrões de Código

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configurados
- ✅ Clean Architecture
- ✅ DTOs para validação
- ✅ Tratamento de erros consistente

### Licenciamento

Este projeto é privado e não possui licença pública. Todos os direitos reservados.

---

## 📞 Contato e Suporte

Para questões sobre o projeto, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para LarAngola**
