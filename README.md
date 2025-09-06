# 🌱 Recoleta API

Uma API RESTful desenvolvida em NestJS para gerenciamento de resíduos, conectando pessoas que desejam descartar materiais com coletores interessados em reutilizá-los.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Observabilidade](#observabilidade)
- [Contribuição](#contribuição)

## 📖 Sobre o Projeto

O **Recoleta API** é uma plataforma que facilita a conexão entre pessoas que possuem resíduos para descartar e coletores que podem reutilizar esses materiais. O sistema permite cadastrar resíduos com informações detalhadas sobre tipo, condição, localização e disponibilidade para coleta.

### Principais objetivos:
- 🌍 **Sustentabilidade**: Promover a reutilização e reciclagem de materiais
- 🤝 **Conexão**: Facilitar o encontro entre doadores e coletores
- 📍 **Localização**: Sistema de busca por proximidade geográfica
- 📱 **Simplicidade**: Interface intuitiva e fácil de usar

## ✨ Funcionalidades

### 👤 Gestão de Usuários
- Registro e autenticação de usuários
- Gerenciamento de perfil
- Sistema de autenticação JWT

### 📍 Gerenciamento de Endereços
- Cadastro de múltiplos endereços por usuário
- Suporte a coordenadas geográficas (latitude/longitude)
- Endereços vinculados aos resíduos

### ♻️ Gestão de Resíduos
- Cadastro detalhado de resíduos com múltiplas categorias
- Upload de imagens dos materiais
- Status de disponibilidade (Disponível, Solicitado, Coletado)
- Sistema de busca com filtros avançados
- Busca por proximidade geográfica

### 🔍 Sistema de Busca
- Filtros por tipo de resíduo, localização e distância
- Paginação de resultados
- Ordenação por proximidade

## 🛠 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM para banco de dados
- **MongoDB** - Banco de dados NoSQL
- **Passport JWT** - Autenticação e autorização

### Observabilidade e Logs
- **Winston** - Sistema de logs estruturados
- **OpenTelemetry** - Observabilidade e rastreamento
- **OTLP gRPC Exporters** - Exportação de métricas e traces

### Documentação e Validação
- **Swagger/OpenAPI** - Documentação automática da API
- **Class Validator** - Validação de dados
- **Class Transformer** - Transformação de objetos

### Protocolos
- **REST API** - Interface HTTP
- **gRPC** - Comunicação de alta performance
- **Protocol Buffers** - Serialização de dados

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **pnpm** (gerenciador de pacotes)
- **MongoDB** (local ou serviço na nuvem)
- **Git** (para controle de versão)

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/Luizustavo/api-recoleta.git
cd api-recoleta
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:
```env
# Database
DATABASE_URL="mongodb://localhost:27017/recoleta"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Server
HTTP_PORT=3004
GRPC_PORT=5000

# OpenTelemetry (opcional)
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
```

### 4. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Sincronizar o esquema (MongoDB não precisa de migrações)
npx prisma db push
```

### 5. Execute a aplicação

```bash
# Modo desenvolvimento
pnpm run start:dev

# Modo produção
pnpm run build
pnpm run start:prod
```

A API estará disponível em:
- **HTTP REST API**: `http://localhost:3004`
- **Documentação Swagger**: `http://localhost:3004/api`
- **gRPC Server**: `localhost:5000`

## 📁 Estrutura do Projeto

```
src/
├── application/              # Camada de aplicação
│   ├── dtos/                # Data Transfer Objects
│   ├── mapper/              # Mapeamento entre camadas
│   ├── services/            # Serviços de aplicação
│   └── use-cases/           # Casos de uso
├── domain/                  # Camada de domínio
│   ├── entities/            # Entidades de negócio
│   ├── enums/               # Enumerações
│   └── repositories/        # Interfaces de repositório
├── infrastructure/          # Camada de infraestrutura
│   ├── auth/                # Autenticação e autorização
│   ├── persistence/         # Persistência de dados (Prisma)
│   ├── presentation/        # Controllers e apresentação
│   └── telemetry/           # Observabilidade e logs
├── app.module.ts           # Módulo principal
└── main.ts                 # Ponto de entrada da aplicação
```

## 📚 Documentação da API

### Swagger/OpenAPI
A documentação completa da API está disponível em:
```
http://localhost:3004/api
```

### Especificação OpenAPI
O arquivo de especificação está em: `docs/recoleta-api-spec.json`

## 🔐 Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos:

### 1. Registrar um usuário
```http
POST /api/user
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### 2. Fazer login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### 3. Usar o token nas requisições
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔗 Endpoints

### 🔓 Endpoints Públicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/user` | Registro de novo usuário |
| `POST` | `/api/auth/signin` | Login de usuário |
| `POST` | `/api/auth/validate-token` | Validação de token JWT |

### 🔒 Endpoints Protegidos

#### 👤 Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/user` | Listar usuários (admin) |
| `GET` | `/api/user/{id}` | Buscar usuário por ID |
| `PATCH` | `/api/user/{id}` | Atualizar usuário |
| `DELETE` | `/api/user/{id}` | Deletar usuário |

#### 📍 Endereços
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/address` | Criar endereço |
| `GET` | `/api/address` | Listar endereços do usuário |
| `GET` | `/api/address/{id}` | Buscar endereço por ID |
| `PATCH` | `/api/address/{id}` | Atualizar endereço |
| `DELETE` | `/api/address/{id}` | Deletar endereço |

#### ♻️ Resíduos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/waste` | Cadastrar resíduo |
| `GET` | `/api/waste` | Listar resíduos do usuário |
| `GET` | `/api/waste/available` | Buscar resíduos disponíveis |
| `GET` | `/api/waste/{id}` | Buscar resíduo por ID |
| `PATCH` | `/api/waste/{id}` | Atualizar resíduo |
| `DELETE` | `/api/waste/{id}` | Deletar resíduo |
| `POST` | `/api/waste/{id}/collect` | Solicitar coleta |

## 📊 Modelos de Dados

### Usuário
```typescript
{
  id: string
  name: string
  email: string
  password: string (hash)
  createdAt: Date
  updatedAt: Date
  addresses: Address[]
  wastes: Waste[]
}
```

### Endereço
```typescript
{
  id: string
  street: string
  number: string
  city: string
  state: string
  country: string
  zipCode: string
  longitude?: number
  latitude?: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
```

### Resíduo
```typescript
{
  id: string
  wasteType: WasteType
  weight: number
  quantity: number
  unit: UnitType
  condition: ConditionType
  hasPackaging: boolean
  discardDate: Date
  additionalDescription?: string
  images: string[]
  status: WasteStatus
  userId: string
  addressId: string
  createdAt: Date
  updatedAt: Date
}
```

### Enumerações

#### Tipos de Resíduo
- `ELECTRONICS` - Eletrônicos
- `ORGANIC` - Orgânicos
- `PLASTIC` - Plásticos
- `PAPER` - Papel
- `GLASS` - Vidro
- `METAL` - Metal
- `WOOD` - Madeira
- `TEXTILE` - Têxtil
- `MISCELLANEOUS` - Diversos

#### Unidades de Medida
- `KG` - Quilogramas
- `LITERS` - Litros
- `UNITS` - Unidades

#### Condições
- `NEW` - Novo
- `USED` - Usado
- `DAMAGED` - Danificado

#### Status do Resíduo
- `AVAILABLE` - Disponível
- `REQUESTED` - Solicitado
- `COLLECTED` - Coletado

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|---------------|
| `DATABASE_URL` | URL de conexão MongoDB | - |
| `JWT_SECRET` | Chave secreta JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `24h` |
| `HTTP_PORT` | Porta do servidor HTTP | `3004` |
| `GRPC_PORT` | Porta do servidor gRPC | `5000` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Endpoint OpenTelemetry | - |

## 📈 Observabilidade

A aplicação inclui:

### Logs Estruturados
- **Winston** para logs formatados em JSON
- Diferentes níveis de log (error, warn, info, debug)
- Logs rotativos por data

### OpenTelemetry
- Rastreamento de requisições HTTP
- Instrumentação gRPC
- Exportação de métricas via OTLP
- Integração com sistemas de observabilidade

### Métricas Disponíveis
- Tempo de resposta das requisições
- Contadores de erro por endpoint
- Rastreamento de operações do banco de dados

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes E2E
pnpm run test:e2e

# Cobertura de testes
pnpm run test:cov

# Testes em modo watch
pnpm run test:watch
```

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run start:dev      # Inicia em modo desenvolvimento com watch
pnpm run start:debug    # Inicia em modo debug

# Produção
pnpm run build          # Compila o projeto
pnpm run start:prod     # Inicia em modo produção

# Qualidade de código
pnpm run lint           # Executa ESLint
pnpm run format         # Formata código com Prettier

# Banco de dados
npx prisma generate     # Gera o cliente Prisma
npx prisma db push      # Sincroniza schema com o banco
npx prisma studio       # Interface visual do banco
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit
Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Luiz Gustavo** - *Desenvolvimento inicial* - [Luizustavo](https://github.com/Luizustavo)

---

⭐ **Gostou do projeto? Deixe uma estrela!**

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
