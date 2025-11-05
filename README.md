<a name="top"></a>
# 🌱 Recoleta API

Uma API RESTful desenvolvida em NestJS para gerenciamento de resíduos, conectando pessoas que desejam descartar materiais com coletores interessados em reutilizá-los.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Exemplos de Payload](#exemplos-de-payload)
- [Modelos de Dados](#modelos-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Observabilidade](#observabilidade)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuição](#contribuição)

## Sobre o Projeto 

O **Recoleta API** é uma plataforma que facilita a conexão entre pessoas que possuem resíduos para descartar e coletores que podem reutilizar esses materiais. O sistema permite cadastrar resíduos com informações detalhadas sobre tipo, condição, localização e disponibilidade para coleta.

### Principais objetivos:
- 🌍 **Sustentabilidade**: Promover a reutilização e reciclagem de materiais
- 🤝 **Conexão**: Facilitar o encontro entre doadores e coletores
- 📍 **Localização**: Sistema de busca por proximidade geográfica
- 📱 **Simplicidade**: Interface intuitiva e fácil de usar

---

[⬆️ Voltar ao topo](#top)

---


## Funcionalidades

### 👤 Gestão de Usuários
- Registro e autenticação de usuários
- Gerenciamento de perfil
- Sistema de autenticação JWT

### 📍 Gerenciamento de Endereços
- Cadastro de múltiplos endereços por usuário
- Suporte a coordenadas geográficas com validação (latitude/longitude)
- Sistema de coordenadas string com conversão automática para cálculos
- Endereços vinculados aos resíduos

### ♻️ Gestão de Resíduos
- Cadastro detalhado de resíduos com múltiplas categorias (9 tipos)
- Upload de imagens em base64 para Azure Blob Storage
- Processamento automático de imagens (otimização e redimensionamento)
- Status de disponibilidade (Disponível, Assinado, Coletado)
- Sistema de busca com filtros avançados
- **Busca por resíduos disponíveis públicos**
- **Busca por resíduos próprios do usuário logado**
- **Resposta completa com dados do usuário e endereço**

### 🗑️ Sistema de Coletas
- Manifestação de interesse em resíduos disponíveis
- Sistema de status de coleta (SIGNED, COLLECTED, CANCELLED)
- Histórico de coletas por usuário
- Prevenção de duplicação de interesse
- Validação de propriedade (usuário não pode coletar próprios resíduos)

### 🔍 Sistema de Busca Avançado
- Filtros por tipo de resíduo, localização, condição e status
- Paginação inteligente de resultados
- Cálculo de distância geográfica (fórmula Haversine)
- Ordenação por proximidade usando coordenadas
- **Retorno enriquecido**: Os endpoints agora retornam objetos completos de usuário e endereço, não apenas IDs

---

[⬆️ Voltar ao topo](#top)

---


## Tecnologias Utilizadas

### Backend
- **NestJS 10.4.3** - Framework Node.js progressivo e modular
- **TypeScript 5.6.2** - Linguagem de programação com tipagem estática
- **Prisma 5.19.1** - ORM moderno para banco de dados
- **MongoDB** - Banco de dados NoSQL orientado a documentos
- **Passport JWT** - Autenticação e autorização com JSON Web Tokens
- **bcrypt** - Hash seguro de senhas (10 salt rounds)

### Testes
- **Jest 29.7.0** - Framework de testes JavaScript com foco em simplicidade
- **ts-jest 29.2.5** - Preprocessador TypeScript para Jest
- **@nestjs/testing** - Utilitários de teste do NestJS
- **Supertest 7.0.0** - Biblioteca para testes HTTP de alto nível
- **Cobertura de Código** - Coverage reports com thresholds configurados (70%)

### Validação e Conversão
- **Class Validator** - Validação de dados com decoradores personalizados
- **Class Transformer** - Transformação de objetos entre camadas
- **Validadores customizados** - Sistema de coordenadas com validação de range (-90/+90 para latitude, -180/+180 para longitude)

### Armazenamento
- **Azure Blob Storage** - Armazenamento de imagens em nuvem
- **Sharp** - Processamento e otimização de imagens

### Logs e Observabilidade
- **Winston** - Sistema de logs estruturados em JSON
- **OpenTelemetry** - Instrumentação e rastreamento distribuído
- **OTLP Exporter** - Exportação de métricas e traces

### Documentação e Protocolos
- **Swagger/OpenAPI** - Documentação interativa automática da API
- **REST API** - Interface HTTP RESTful
- **gRPC** - Comunicação de alta performance
- **Protocol Buffers** - Serialização eficiente de dados

### Arquitetura e Padrões
- **Clean Architecture** - Separação clara de responsabilidades em camadas
- **Domain-Driven Design (DDD)** - Modelagem orientada ao domínio
- **SOLID Principles** - Princípios de design de software
- **Repository Pattern** - Abstração de acesso a dados
- **Use Case Pattern** - Encapsulamento de lógica de negócio
- **Mapper Pattern** - Conversão entre DTOs e Entities
- **Dependency Injection** - Inversão de controle via NestJS DI Container

---

[⬆️ Voltar ao topo](#top)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **pnpm** (gerenciador de pacotes)
- **MongoDB** (local ou serviço na nuvem)
- **Git** (para controle de versão)

---

[⬆️ Voltar ao topo](#top)

---

## Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/Luizustavo/api-recoleta.git
cd api-recoleta
```

### 2. Instale as dependências
```bash
npm install
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

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
HTTP_PORT=3004
GRPC_PORT=5000

# Azure Blob Storage (para imagens)
AZURE_STORAGE_CONNECTION_STRING="your-azure-storage-connection-string"

# OpenTelemetry (opcional)
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
```

**⚠️ Importante:**
- Altere o `JWT_SECRET` para uma chave segura em produção
- Configure o Azure Blob Storage para habilitar upload de imagens
- O MongoDB pode ser local ou usar serviços como MongoDB Atlas

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
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A API estará disponível em:
- **HTTP REST API**: `http://localhost:3004`
- **Documentação Swagger**: `http://localhost:3004/api`
- **gRPC Server**: `localhost:5000`

## Estrutura do Projeto

```
src/
├── application/                    # 📱 Camada de Aplicação
│   ├── dtos/                      # Data Transfer Objects
│   │   ├── address/               # DTOs de endereços
│   │   ├── auth/                  # DTOs de autenticação
│   │   ├── base/                  # DTOs base (pagination, return)
│   │   ├── collection/            # DTOs de coletas
│   │   ├── user/                  # DTOs de usuários
│   │   └── waste/                 # DTOs de resíduos
│   ├── mapper/                    # Mapeadores entre camadas
│   │   ├── address.mapper.ts
│   │   ├── collection.mapper.ts
│   │   ├── user.mapper.ts
│   │   └── waste.mapper.ts
│   ├── services/                  # Serviços de aplicação
│   │   └── auth.service.ts        # Serviço de autenticação JWT
│   ├── use-cases/                 # Casos de uso (lógica de negócio)
│   │   ├── address/               # Use cases de endereços
│   │   ├── auth/                  # Use cases de autenticação
│   │   ├── collection/            # Use cases de coletas
│   │   ├── user/                  # Use cases de usuários
│   │   └── waste/                 # Use cases de resíduos
│   ├── utils/                     # Utilitários
│   │   └── coordinate.utils.ts    # Conversão e cálculo de coordenadas
│   └── validators/                # Validadores customizados
│       └── coordinate.validator.ts # Validador de coordenadas
│
├── domain/                        # 🏛️ Camada de Domínio
│   ├── entities/                  # Entidades de negócio
│   │   ├── address.entity.ts
│   │   ├── collection.entity.ts
│   │   ├── user.entity.ts
│   │   └── waste.entity.ts
│   ├── enums/                     # Enumerações
│   │   └── return-code.enum.ts
│   └── repositories/              # Interfaces de repositório
│       ├── address-repository.interface.ts
│       ├── collection-repository.interface.ts
│       ├── user-repository.interface.ts
│       └── waste-repository.interface.ts
│
├── infrastructure/                # 🔧 Camada de Infraestrutura
│   ├── auth/                      # Autenticação e autorização
│   │   ├── auth.module.ts
│   │   └── guards/                # Guards JWT
│   ├── persistence/               # Persistência de dados
│   │   ├── prisma/                # Implementações Prisma
│   │   │   ├── address.repository.ts
│   │   │   ├── collection.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── waste.repository.ts
│   │   ├── constants.ts
│   │   └── persistence.module.ts
│   ├── presentation/              # Camada de apresentação
│   │   ├── controllers/           # Controllers REST
│   │   │   ├── address.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── collection.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── waste.controller.ts
│   │   │   └── waste-image.controller.ts
│   │   ├── filters/               # Exception filters
│   │   ├── grpc/                  # Controllers gRPC
│   │   └── presentation.module.ts
│   ├── storage/                   # Armazenamento
│   │   ├── azure-blob.module.ts
│   │   └── azure-blob.service.ts  # Serviço Azure Blob Storage
│   └── telemetry/                 # Observabilidade
│       ├── span.config.ts
│       ├── telemetry.config.ts
│       ├── telemetry.module.ts
│       ├── trace.service.ts
│       └── winston.config.ts      # Configuração Winston
│
├── app.module.ts                  # Módulo principal da aplicação
└── main.ts                        # Ponto de entrada (bootstrap)

test/                              # 🧪 Testes
├── app.e2e-spec.ts               # Testes E2E
└── jest-e2e.json                 # Configuração Jest E2E

prisma/                            # 💾 Banco de Dados
└── schema.prisma                 # Schema Prisma (MongoDB)

coverage/                          # 📊 Cobertura de Testes
└── lcov-report/                  # Relatórios HTML de cobertura

docs/                              # 📚 Documentação
├── DOCUMENTACAO_TECNICA_PARTE1.md # Doc completa Jest
├── DOCUMENTACAO_TECNICA_PARTE2.md # Doc completa API/DB
├── TESTING.md                     # Guia de testes
├── JEST_SETUP_SUMMARY.md         # Resumo Jest
└── QUICK_START_TESTING.md        # Guia rápido testes
```

### Camadas da Clean Architecture

| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| **Domain** | Regras de negócio puras | Entities, Interfaces, Enums |
| **Application** | Lógica de aplicação | Use Cases, DTOs, Mappers |
| **Infrastructure** | Detalhes técnicos | Prisma, Azure, Controllers |
| **Presentation** | Interface com usuário | REST Controllers, gRPC |
---

[⬆️ Voltar ao topo](#top)

---

## Documentação da API

### 📖 Documentação Técnica Completa

Este projeto possui documentação técnica abrangente dividida em duas partes:

#### Parte 1 - Testes com Jest
**Arquivo:** [DOCUMENTACAO_TECNICA_PARTE1.md](DOCUMENTACAO_TECNICA_PARTE1.md)

Conteúdo completo sobre testes:
- Introdução ao Jest e configuração detalhada
- Todos os 64 testes documentados com descrições
- Evidências de execução (console output, timing)
- Relatórios de cobertura por módulo
- 7 exemplos práticos de diferentes tipos de teste
- Guia de mocking e boas práticas

#### Parte 2 - API e Banco de Dados
**Arquivo:** [DOCUMENTACAO_TECNICA_PARTE2.md](DOCUMENTACAO_TECNICA_PARTE2.md)

Conteúdo completo sobre a API:
- Arquitetura Clean Architecture e DDD
- **22 endpoints** documentados com request/response
- **4 collections** do MongoDB detalhadas
- Modelos de dados (Entities, DTOs)
- Fluxos de negócio com diagramas
- Segurança (JWT, bcrypt, validações)
- Sistema de logs e observabilidade
- Armazenamento de imagens (Azure Blob)

### 🌐 Swagger/OpenAPI Interativo

A documentação interativa da API está disponível em:
```
http://localhost:3004/api
```

Funcionalidades do Swagger:
- Visualização de todos os endpoints
- Teste direto dos endpoints via interface
- Schemas de request/response
- Autenticação JWT integrada
- Exemplos de payloads

### 📄 Especificação OpenAPI
O arquivo de especificação está em: `docs/recoleta-api-spec.json`

---

[⬆️ Voltar ao topo](#top)

---

## Autenticação

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

---

[⬆️ Voltar ao topo](#top)

---

## Endpoints

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
| `GET` | `/api/waste/my-wastes` | **Listar resíduos do usuário logado** |
| `GET` | `/api/waste/available` | **Buscar resíduos disponíveis para coleta** |
| `GET` | `/api/waste/{id}` | Buscar resíduo por ID |
| `PUT` | `/api/waste/{id}` | Atualizar resíduo |
| `DELETE` | `/api/waste/{id}` | Deletar resíduo |

#### 🗑️ Coletas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/collection` | Manifestar interesse em coletar resíduo |
| `GET` | `/api/collection/my` | Listar coletas do usuário logado |

#### 🖼️ Imagens
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/images/{path}` | Servir imagem pública do Azure Blob |

### 📋 Parâmetros de Busca

#### GET /api/waste/available
Busca resíduos disponíveis para coleta com filtros e paginação. Exclui automaticamente os resíduos criados pelo usuário logado:

**Query Parameters:**
- `wasteType` (opcional): Filtrar por tipo de resíduo
- `location` (opcional): Filtrar por cidade ou estado
- `condition` (opcional): Filtrar por condição
- `page` (opcional, padrão: 1): Página da paginação
- `limit` (opcional, padrão: 10): Itens por página

**Exemplo:**
```
GET /api/waste/available?wasteType=ELECTRONICS&location=São Paulo&page=1&limit=5
```

#### GET /api/waste/my-wastes
Lista todos os resíduos cadastrados pelo usuário logado:

**Query Parameters:**
- `page` (opcional, padrão: 1): Página da paginação
- `limit` (opcional, padrão: 10): Itens por página

**Exemplo:**
```
GET /api/waste/my-wastes?page=2&limit=20
```

### 🎯 Resposta Enriquecida

**Importante:** Os endpoints de busca agora retornam objetos completos ao invés de apenas IDs:

```json
{
  "id": "68bc4ee12cb69c49e1224996",
  "wasteType": "ELECTRONICS",
  "weight": 1,
  "quantity": 1,
  "unit": "KG",
  "condition": "NEW",
  "hasPackaging": false,
  "discardDate": "2025-09-05T15:11:00.000Z",
  "status": "AVAILABLE",
  "additionalDescription": "Notebook Dell funcionando",
  "images": [],
  "userId": "68bc2e6555d8b97472bb05a9",
  "addressId": "68bc4ee12cb69c49e1224995",
  "user": {
    "id": "68bc2e6555d8b97472bb05a9",
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "address": {
    "street": "Rua das Palmeiras",
    "city": "São Paulo",
    "state": "SP",
    "latitude": "-23.550520",
    "longitude": "-46.633308"
  },
  "createdAt": "2025-09-06T15:10:25.075Z",
  "updatedAt": "2025-09-06T15:10:25.075Z"
}
```
---

[⬆️ Voltar ao topo](#top)

---

## Exemplos de Payload

### Criar Resíduo - POST /api/waste

```json
{
  "waste": {
    "wasteType": "ELECTRONICS",
    "weight": 3.2,
    "quantity": 1,
    "unit": "KG",
    "condition": "USED",
    "hasPackaging": true,
    "discardDate": "2025-09-10T15:30:00.000Z",
    "additionalDescription": "Notebook Dell Inspiron funcionando parcialmente, tela com risco, carregador incluído. Ideal para peças ou reparo.",
    "images": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/...",
      "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    ]
  },
  "address": {
    "street": "Rua das Palmeiras",
    "number": "456",
    "complement": "Apartamento 12B",
    "neighborhood": "Vila Madalena",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "05435-020",
    "reference": "Próximo ao metrô Vila Madalena",
    "main": false
  }
}
```

### Outros Exemplos por Categoria

#### Resíduo Orgânico
```json
{
  "waste": {
    "wasteType": "ORGANIC",
    "weight": 5.0,
    "quantity": 2,
    "unit": "KG",
    "condition": "NEW",
    "hasPackaging": false,
    "discardDate": "2025-09-06T08:00:00.000Z",
    "additionalDescription": "Cascas de frutas e restos vegetais para compostagem",
    "images": []
  },
  "address": {
    "street": "Rua Augusta",
    "number": "1200",
    "neighborhood": "Consolação",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01305-100",
    "main": true
  }
}
```

#### Plástico
```json
{
  "waste": {
    "wasteType": "PLASTIC",
    "weight": 1.5,
    "quantity": 10,
    "unit": "UNITS",
    "condition": "USED",
    "hasPackaging": true,
    "discardDate": "2025-09-07T14:00:00.000Z",
    "additionalDescription": "Garrafas PET de 500ml limpas e sem rótulo",
    "images": ["data:image/jpeg;base64,..."]
  },
  "address": {
    "street": "Avenida Paulista",
    "number": "2000",
    "complement": "Loja 15",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-200",
    "reference": "Em frente ao MASP",
    "main": false
  }
}
```

#### Papel
```json
{
  "waste": {
    "wasteType": "PAPER",
    "weight": 2.8,
    "quantity": 50,
    "unit": "UNITS",
    "condition": "USED",
    "hasPackaging": false,
    "discardDate": "2025-09-08T10:30:00.000Z",
    "additionalDescription": "Revistas e jornais em bom estado de conservação",
    "images": []
  },
  "address": {
    "street": "Rua Oscar Freire",
    "number": "300",
    "neighborhood": "Jardins",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01426-000",
    "main": true
  }
}
```

### Valores Aceitos pelos Enums

#### Tipos de Resíduo (wasteType):
- `ELECTRONICS` - Eletrônicos
- `ORGANIC` - Orgânicos  
- `PLASTIC` - Plásticos
- `PAPER` - Papel
- `GLASS` - Vidros
- `METAL` - Metais
- `WOOD` - Madeira
- `TEXTILE` - Têxteis
- `MISCELLANEOUS` - Diversos

#### Unidades de Medida (unit):
- `KG` - Quilogramas
- `LITERS` - Litros
- `UNITS` - Unidades

#### Condições (condition):
- `NEW` - Novo
- `USED` - Usado
- `DAMAGED` - Danificado

#### Status do Resíduo (status):
- `AVAILABLE` - Disponível (padrão)
- `REQUESTED` - Solicitado
- `COLLECTED` - Coletado

**Notas Importantes:**
- `discardDate` deve estar no formato ISO 8601: `YYYY-MM-DDTHH:MM:SS.sssZ`
- `images` é um array de strings em formato base64 (opcional)
- `userId` e `addressId` são inseridos automaticamente pela API baseados na autenticação
- `hasPackaging` é um boolean (true/false)
- Todos os campos do `address` são obrigatórios exceto `complement`, `reference` e `main`
- Se `main` for `true`, este será o endereço principal do usuário

---

[⬆️ Voltar ao topo](#top)

---

## Modelos de Dados

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
  longitude?: string  // Armazenado como string, convertido para cálculos
  latitude?: string   // Armazenado como string, convertido para cálculos
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
  user?: UserDto      // Objeto completo do usuário (quando disponível)
  address?: AddressDto // Objeto completo do endereço (quando disponível)
  createdAt: Date
  updatedAt: Date
}
```

### Coleta
```typescript
{
  id: string
  collectorId: string     // ID do usuário que quer coletar
  wasteId: string         // ID do resíduo
  status: CollectionStatus
  signedAt: Date          // Data da manifestação de interesse
  collectedAt?: Date      // Data da coleta (quando finalizada)
  createdAt: Date
  updatedAt: Date
}
```

### Enumerações

#### Tipos de Resíduo (WasteType)
- `ELECTRONICS` - Eletrônicos
- `ORGANIC` - Orgânicos
- `PLASTIC` - Plásticos
- `PAPER` - Papel
- `GLASS` - Vidro
- `METAL` - Metal
- `WOOD` - Madeira
- `TEXTILE` - Têxtil
- `MISCELLANEOUS` - Diversos

#### Unidades de Medida (UnitType)
- `KG` - Quilogramas
- `LITERS` - Litros
- `UNITS` - Unidades

#### Condições (ConditionType)
- `NEW` - Novo
- `USED` - Usado
- `DAMAGED` - Danificado

#### Status do Resíduo (WasteStatus)
- `AVAILABLE` - Disponível para coleta
- `SIGNED` - Alguém manifestou interesse
- `COLLECTED` - Já foi coletado

#### Status da Coleta (CollectionStatus)
- `SIGNED` - Manifestação de interesse registrada
- `COLLECTED` - Coleta realizada com sucesso
- `CANCELLED` - Coleta cancelada

---

[⬆️ Voltar ao topo](#top)

---

## Variáveis de Ambiente

| Variável | Descrição | Valor Padrão | Obrigatório |
|----------|-----------|---------------|-------------|
| `DATABASE_URL` | URL de conexão MongoDB | - | ✅ Sim |
| `JWT_SECRET` | Chave secreta JWT para assinatura de tokens | - | ✅ Sim |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT | `24h` | Não |
| `HTTP_PORT` | Porta do servidor HTTP REST | `3004` | Não |
| `GRPC_PORT` | Porta do servidor gRPC | `5000` | Não |
| `AZURE_STORAGE_CONNECTION_STRING` | String de conexão Azure Blob Storage | - | ✅ Sim (para imagens) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Endpoint OpenTelemetry para traces | - | Não |

**Exemplos:**

```env
# Desenvolvimento Local
DATABASE_URL="mongodb://localhost:27017/recoleta"
JWT_SECRET="dev-secret-change-in-production"
JWT_EXPIRES_IN="24h"
HTTP_PORT=3004
GRPC_PORT=5000

# Produção (MongoDB Atlas)
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/recoleta?retryWrites=true&w=majority"
JWT_SECRET="super-secure-random-key-production"
JWT_EXPIRES_IN="12h"
HTTP_PORT=3004

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=youraccountname;AccountKey=youraccountkey;EndpointSuffix=core.windows.net"

# OpenTelemetry (Opcional)
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
```

---

[⬆️ Voltar ao topo](#top)

---

## Observabilidade

A aplicação inclui:

### Logs Estruturados
- **Winston** para logs formatados em JSON
- Diferentes níveis de log (error, warn, info, debug)
- Logs rotativos por data
- Rastreamento de operações críticas

### OpenTelemetry
- Rastreamento de requisições HTTP
- Instrumentação gRPC
- Exportação de métricas via OTLP
- Integração com sistemas de observabilidade

### Métricas Disponíveis
- Tempo de resposta das requisições
- Contadores de erro por endpoint
- Rastreamento de operações do banco de dados
- Monitoramento de casos de uso

---

[⬆️ Voltar ao topo](#top)

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start          # Inicia a aplicação
npm run start:dev      # Inicia em modo desenvolvimento com watch
npm run start:debug    # Inicia em modo debug (porta 9229)

# Produção
npm run build          # Compila o projeto para JavaScript
npm run start:prod     # Inicia em modo produção (requer build)

# Qualidade de código
npm run lint           # Executa ESLint para análise estática
npm run format         # Formata código com Prettier

# Testes
npm test               # Executa todos os testes unitários
npm run test:watch     # Testes em modo watch (útil durante desenvolvimento)
npm run test:cov       # Executa testes com cobertura de código
npm run test:debug     # Executa testes em modo debug
npm run test:e2e       # Testes E2E (end-to-end) - estrutura configurada

# Banco de dados
npx prisma generate     # Gera o cliente Prisma TypeScript
npx prisma db push      # Sincroniza schema com o banco MongoDB
npx prisma studio       # Interface visual do banco (porta 5555)
```

---

[⬆️ Voltar ao topo](#top)

---

## 🧪 Testes

Este projeto utiliza **Jest 29.7.0** como framework de testes com suporte completo a TypeScript via ts-jest.

### Estatísticas de Testes

| Métrica | Valor |
|---------|-------|
| **Test Suites** | 8 suites |
| **Testes Totais** | 64 testes |
| **Status** | ✅ 100% passando |
| **Tempo de Execução** | ~10 segundos |
| **Cobertura Global** | 12.03% |

### Módulos Testados

| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| **coordinate.utils** | 23 testes | 🟢 100% |
| **auth.service** | 6 testes | 🟢 85.71% |
| **user.mapper** | 4 testes | 🟢 87.50% |
| **address.mapper** | 6 testes | 🟢 88.88% |
| **coordinate.validator** | 8 testes | 🟡 33.33% |
| **login.use-case** | 7 testes | 🟡 54.16% |
| **create-user.use-case** | 5 testes | 🔴 19.09% |
| **create-address.use-case** | 5 testes | 🔴 19.35% |

### Comandos de Teste

```bash
# Executa todos os testes
npm test

# Executa testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Gera relatório de cobertura completo
npm run test:cov

# Executa testes em modo debug (porta 9229)
npm run test:debug

# Executa testes E2E
npm run test:e2e
```

### Visualizar Cobertura

Após executar `npm run test:cov`, o relatório HTML será gerado em:
```
coverage/lcov-report/index.html
```

Abra este arquivo no navegador para visualizar a cobertura detalhada por arquivo.

### Documentação Completa de Testes

Para informações detalhadas sobre testes, consulte:

- 📖 **[TESTING.md](TESTING.md)** - Guia completo de testes (configuração, exemplos, mocking)
- 📋 **[JEST_SETUP_SUMMARY.md](JEST_SETUP_SUMMARY.md)** - Resumo da configuração do Jest
- 📄 **[QUICK_START_TESTING.md](QUICK_START_TESTING.md)** - Guia rápido para começar
- 📑 **[DOCUMENTACAO_TECNICA_PARTE1.md](DOCUMENTACAO_TECNICA_PARTE1.md)** - Documentação técnica completa do Jest

### Tipos de Testes Implementados

1. **Testes Unitários Simples** - Funções puras e lógica isolada
2. **Testes com Mocks** - Services com dependências mockadas
3. **Testes de Validação** - Validators customizados
4. **Testes de Mappers** - Conversão entre DTOs e Entities
5. **Testes de Use Cases** - Lógica de negócio completa
6. **Testes de Cálculo** - Funções matemáticas (distância, coordenadas)
7. **Testes de Erros** - Tratamento de exceções

### Exemplo de Teste

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: {
            findAsync: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get('IUserRepository');
  });

  it('should validate user with correct credentials', async () => {
    const user = new UserEntity({ 
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User'
    }, '1');
    
    userRepository.findAsync.mockResolvedValue(user);

    const result = await service.validateUser('test@example.com', 'password123');
    
    expect(result).toBeDefined();
    expect(result?.email).toBe('test@example.com');
  });
});
```

## 🔧 Validações Customizadas

O projeto implementa validadores customizados para garantir a integridade dos dados:

### Coordenadas Geográficas
- **@IsCoordinate()**: Valida strings de latitude e longitude
- **Latitude**: Aceita valores entre -90 e +90
- **Longitude**: Aceita valores entre -180 e +180
- **Formato**: String que pode ser convertida para número

### Sistema de Coordenadas
- Armazenamento como **string** no banco de dados
- Conversão automática para **number** apenas para cálculos
- Utilities disponíveis em `src/infrastructure/persistence/utils/coordinate.utils.ts`

## 🚀 Melhorias Recentes

### v2.1.0 - Sistema de Coordenadas Otimizado
- ✅ Migração de coordenadas Float para String no banco
- ✅ Validador customizado @IsCoordinate para strings
- ✅ Utilities para conversão e cálculo de distância (Haversine)
- ✅ Correção de bugs de conversão null/undefined
- ✅ Validação de range para latitude (-90 a +90) e longitude (-180 a +180)

### v2.2.0 - Endpoints de Resíduos Aprimorados
- ✅ Novo endpoint `/waste/my-wastes` para resíduos do usuário
- ✅ Correção de bugs de paginação (NaN values)
- ✅ Resposta enriquecida com objetos completos de user e address
- ✅ Melhoria na arquitetura com entidades estendidas
- ✅ Sistema de busca com filtros (tipo, localização, condição)

### v2.3.0 - Arquitetura Clean
- ✅ Implementação de Clean Architecture completa
- ✅ Separação clara entre Domain, Application e Infrastructure
- ✅ Use Cases bem definidos para cada operação
- ✅ Mappers para conversão entre DTOs e Entities
- ✅ Repository Pattern com interfaces abstratas
- ✅ Dependency Injection configurada

### v2.4.0 - Sistema de Coletas
- ✅ Novo módulo de Collections para gerenciar coletas
- ✅ Endpoint para manifestação de interesse em resíduos
- ✅ Sistema de status de coleta (SIGNED, COLLECTED, CANCELLED)
- ✅ Validação de propriedade (usuário não pode coletar próprios resíduos)
- ✅ Prevenção de duplicação de interesse
- ✅ Histórico completo de coletas por usuário

### v2.5.0 - Testes e Qualidade de Código
- ✅ **Jest 29.7.0** configurado com TypeScript
- ✅ **64 testes** implementados (100% passando)
- ✅ **8 test suites** cobrindo múltiplos módulos
- ✅ Cobertura de código configurada (threshold: 70%)
- ✅ Testes unitários para services, mappers, validators e use cases
- ✅ Estrutura E2E configurada
- ✅ Mocking completo de dependências
- ✅ Documentação completa de testes (TESTING.md)
- ✅ 100% de cobertura em coordinate.utils
- ✅ 85%+ de cobertura em services e mappers

### v2.6.0 - Armazenamento e Imagens
- ✅ Integração com Azure Blob Storage
- ✅ Upload de imagens em base64
- ✅ Processamento automático com Sharp (resize, otimização)
- ✅ URLs públicas para imagens de resíduos
- ✅ Endpoint para servir imagens estáticas

---

[⬆️ Voltar ao topo](#top)

---

## Contribuição

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

---

[⬆️ Voltar ao topo](#top)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Luiz Gustavo** - *Desenvolvimento inicial* - [Luizustavo](https://github.com/Luizustavo)
- **Alexandre Alvarenga** - *Desenvolvedor* - [wakenedo](https://github.com/wakenedo)

---

⭐ **Gostou do projeto? Deixe uma estrela!**

🔗 **Links Úteis:**
- [Documentação da API](http://localhost:3004/api) (quando rodando localmente)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

📫 **Contato:**
- GitHub: [@Luizustavo](https://github.com/Luizustavo)

---

## 📊 Estatísticas do Projeto

### Código e Arquitetura

| Métrica | Valor |
|---------|-------|
| **Linguagem** | TypeScript 5.6.2 |
| **Framework** | NestJS 10.4.3 |
| **Camadas Arquiteturais** | 4 (Domain, Application, Infrastructure, Presentation) |
| **Padrões de Design** | 6+ (Repository, Use Case, Mapper, Factory, DI, etc.) |
| **Controllers REST** | 6 controllers |
| **Endpoints REST** | 22 endpoints |
| **Entities** | 4 entidades |
| **Use Cases** | 20+ casos de uso |
| **Repositories** | 4 repositories |

### Testes e Qualidade

| Métrica | Valor |
|---------|-------|
| **Framework de Testes** | Jest 29.7.0 |
| **Test Suites** | 8 suites |
| **Testes Totais** | 64 testes |
| **Taxa de Sucesso** | 100% ✅ |
| **Cobertura Global** | 12.03% |
| **Módulos 100% Cobertos** | 1 (coordinate.utils) |
| **Módulos 85%+ Cobertos** | 3 (services, mappers) |
| **Tempo de Execução** | ~10 segundos |

### Banco de Dados

| Métrica | Valor |
|---------|-------|
| **Database** | MongoDB |
| **ORM** | Prisma 5.19.1 |
| **Collections** | 4 (users, addresses, wastes, collections) |
| **Enums** | 5 enumerações |
| **Índices** | 10+ índices otimizados |
| **Relacionamentos** | 1:N (Users, Addresses, Wastes, Collections) |

### Funcionalidades

| Módulo | Operações | Status |
|--------|-----------|--------|
| **Autenticação** | Login, Validação JWT | ✅ Completo |
| **Usuários** | CRUD completo | ✅ Completo |
| **Endereços** | CRUD com geolocalização | ✅ Completo |
| **Resíduos** | CRUD + Busca avançada | ✅ Completo |
| **Coletas** | Criar, Listar | ✅ Completo |
| **Imagens** | Upload, Storage, Servir | ✅ Completo |

### Documentação

| Documento | Páginas | Conteúdo |
|-----------|---------|----------|
| **README.md** | ~80 linhas | Guia completo do projeto |
| **DOCUMENTACAO_TECNICA_PARTE1.md** | ~50 páginas | Jest, testes, evidências |
| **DOCUMENTACAO_TECNICA_PARTE2.md** | ~40 páginas | API, DB, arquitetura |
| **TESTING.md** | ~30 páginas | Guia de testes |
| **JEST_SETUP_SUMMARY.md** | ~5 páginas | Resumo configuração |
| **QUICK_START_TESTING.md** | ~3 páginas | Guia rápido |
| **Swagger/OpenAPI** | Interativo | Documentação live |

### Infraestrutura e DevOps

| Tecnologia | Uso |
|------------|-----|
| **Azure Blob Storage** | Armazenamento de imagens |
| **Winston** | Logs estruturados JSON |
| **OpenTelemetry** | Observabilidade e traces |
| **Prisma Studio** | Interface visual do banco |
| **ESLint** | Análise estática de código |
| **Prettier** | Formatação automática |
| **Jest** | Testes automatizados |

---

**⚡ Tecnologias: NestJS • TypeScript • MongoDB • Prisma • Jest • Azure • JWT • Clean Architecture**
