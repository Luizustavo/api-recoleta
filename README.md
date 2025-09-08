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
- [Exemplos de Payload](#exemplos-de-payload)
- [Modelos de Dados](#modelos-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Observabilidade](#observabilidade)
- [Scripts Disponíveis](#scripts-disponíveis)
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
- Suporte a coordenadas geográficas com validação (latitude/longitude)
- Sistema de coordenadas string com conversão automática para cálculos
- Endereços vinculados aos resíduos

### ♻️ Gestão de Resíduos
- Cadastro detalhado de resíduos com múltiplas categorias
- Upload de imagens dos materiais
- Status de disponibilidade (Disponível, Solicitado, Coletado)
- Sistema de busca com filtros avançados
- **Busca por resíduos disponíveis públicos**
- **Busca por resíduos próprios do usuário logado**
- **Resposta completa com dados do usuário e endereço**

### 🔍 Sistema de Busca Avançado
- Filtros por tipo de resíduo, localização e distância
- Paginação inteligente de resultados
- Ordenação por proximidade
- **Retorno enriquecido**: Os endpoints agora retornam objetos completos de usuário e endereço, não apenas IDs

## 🛠 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM para banco de dados
- **MongoDB** - Banco de dados NoSQL
- **Passport JWT** - Autenticação e autorização

### Validação e Conversão
- **Class Validator** - Validação de dados com decoradores personalizados
- **Class Transformer** - Transformação de objetos
- **Validadores customizados** - Sistema de coordenadas com validação de range

### Logs
- **Winston** - Sistema de logs estruturados

### Documentação e Protocolos
- **Swagger/OpenAPI** - Documentação automática da API
- **REST API** - Interface HTTP
- **gRPC** - Comunicação de alta performance
- **Protocol Buffers** - Serialização de dados

### Arquitetura
- **Clean Architecture** - Separação clara de responsabilidades
- **Domain-Driven Design** - Modelagem orientada ao domínio
- **SOLID Principles** - Princípios de design de software

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

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Server
HTTP_PORT=3004

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
npm run start:dev

# Modo produção
npm run build
npm run start:prod
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
| `GET` | `/api/waste/my-wastes` | **Listar resíduos do usuário logado** |
| `GET` | `/api/waste/available` | **Buscar resíduos disponíveis (público)** |
| `GET` | `/api/waste/{id}` | Buscar resíduo por ID |
| `PATCH` | `/api/waste/{id}` | Atualizar resíduo |
| `DELETE` | `/api/waste/{id}` | Deletar resíduo |

### 📋 Parâmetros de Busca

#### GET /api/waste/available
Busca resíduos disponíveis para coleta com filtros e paginação:

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

## � Exemplos de Payload

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

## �📊 Modelos de Dados

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

# Testes
pnpm run test           # Testes unitários
pnpm run test:e2e       # Testes E2E
pnpm run test:cov       # Cobertura de testes
pnpm run test:watch     # Testes em modo watch

# Banco de dados
npx prisma generate     # Gera o cliente Prisma
npx prisma db push      # Sincroniza schema com o banco
npx prisma studio       # Interface visual do banco
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
- ✅ Utilities para conversão e cálculo de distância
- ✅ Correção de bugs de conversão null/undefined

### v2.2.0 - Endpoints de Resíduos Aprimorados
- ✅ Novo endpoint `/waste/my-wastes` para resíduos do usuário
- ✅ Correção de bugs de paginação (NaN values)
- ✅ Resposta enriquecida com objetos completos de user e address
- ✅ Melhoria na arquitetura com entidades estendidas

### v2.3.0 - Arquitetura Clean
- ✅ Implementação de Clean Architecture
- ✅ Separação clara entre Domain, Application e Infrastructure
- ✅ Use Cases bem definidos
- ✅ Mappers para conversão entre camadas

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

🔗 **Links Úteis:**
- [Documentação da API](http://localhost:3004/api) (quando rodando localmente)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

📫 **Contato:**
- GitHub: [@Luizustavo](https://github.com/Luizustavo)
- Email: luizgustavosantosdasilva@outlook.com
