# 🗑️ Waste API Routes Documentation

Documentação completa das rotas da API de resíduos para integração com o frontend.

## Base URL
```
http://localhost:3004/api
```

## Autenticação
Todas as rotas protegidas requerem o header de autorização:
```
Authorization: Bearer <#### Other Examples Updated (200)
```javascript
{
  "success": true,
  "message": "Resíduo atualizado com sucesso",
  "code": "SUCCESS",
  "data": {
    "id": "66d9a5b2c8f1234567890abc",
    "wasteType": "PLASTIC",
    "weight": 2.5,
    "quantity": 5,
    "unit": "UNITS",
    "condition": "NEW",
    "hasPackaging": false,
    "discardDate": "2025-09-15T10:00:00.000Z",
    "additionalDescription": "Garrafas PET limpas",
    "images": ["data:image/jpeg;base64,..."],
    "status": "AVAILABLE",
    "userId": "66d8f4a2c8f1234567890xyz",
    "addressId": "66d9a1b2c8f1234567890def",
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T14:30:00.000Z"
  }
}
```---

## 📋 Lista de Rotas

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/waste` | ✅ Obrigatória | Criar novo resíduo |
| `GET` | `/waste/available` | ❌ Não requerida | Listar resíduos disponíveis |
| `GET` | `/waste/:id` | ❌ Não requerida | Buscar resíduo por ID |
| `PUT` | `/waste/:id` | ✅ Obrigatória | Atualizar resíduo |
| `DELETE` | `/waste/:id` | ✅ Obrigatória | Deletar resíduo |

---

## 🔗 Detalhamento das Rotas

### 1. Criar Resíduo
**`POST /api/waste`** 🔒

#### Request Headers
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

#### Request Body
```javascript
{
  "waste": {
    "wasteType": "ELECTRONICS",              // ENUM: ELECTRONICS, ORGANIC, PLASTIC, PAPER, GLASS, METAL, WOOD, TEXTILE, MISCELLANEOUS
    "weight": 3.2,                          // number
    "quantity": 1,                          // number
    "unit": "KG",                          // ENUM: KG, LITERS, UNITS
    "condition": "USED",                    // ENUM: NEW, USED, DAMAGED
    "hasPackaging": true,                   // boolean
    "discardDate": "2025-09-10T15:30:00.000Z", // ISO 8601 string
    "additionalDescription": "Notebook Dell Inspiron funcionando parcialmente", // string (opcional)
    "images": [                            // array de strings (opcional)
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
    ]
  },
  "address": {
    "street": "Rua das Palmeiras",         // string
    "number": "456",                       // string
    "complement": "Apartamento 12B",       // string (opcional)
    "neighborhood": "Vila Madalena",       // string
    "city": "São Paulo",                   // string
    "state": "SP",                         // string
    "zipCode": "05435-020",               // string
    "reference": "Próximo ao metrô",       // string (opcional)
    "main": false                          // boolean (opcional)
  }
}
```

#### Response Success (201)
```javascript
{
  "success": true,
  "message": "Resíduo criado com sucesso",
  "code": "SUCCESS",
  "data": {
    "id": "66d9a5b2c8f1234567890abc",
    "wasteType": "ELECTRONICS",
    "weight": 3.2,
    "quantity": 1,
    "unit": "KG",
    "condition": "USED",
    "hasPackaging": true,
    "discardDate": "2025-09-10T15:30:00.000Z",
    "additionalDescription": "Notebook Dell Inspiron funcionando parcialmente",
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."],
    "status": "AVAILABLE",
    "userId": "66d8f4a2c8f1234567890xyz",
    "addressId": "66d9a1b2c8f1234567890def",
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T12:00:00.000Z"
  }
}
```

#### Response Error (400)
```javascript
{
  "success": false,
  "message": "Dados inválidos",
  "code": "VALIDATION_ERROR"
}
```

#### Response Error (401)
```javascript
{
  "success": false,
  "message": "Token inválido ou ausente",
  "code": "UNAUTHORIZED"
}
```

---

### 2. Listar Resíduos Disponíveis
**`GET /api/waste/available`** 🌐

#### Query Parameters
```javascript
?wasteType=ELECTRONICS&condition=USED&location=São Paulo&page=1&limit=10
```

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `wasteType` | string | ❌ | Filtrar por tipo (ELECTRONICS, ORGANIC, etc.) |
| `condition` | string | ❌ | Filtrar por condição (NEW, USED, DAMAGED) |
| `location` | string | ❌ | Filtrar por localização |
| `page` | number | ❌ | Página (padrão: 1) |
| `limit` | number | ❌ | Itens por página (padrão: 10) |

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Resíduos disponíveis encontrados",
  "code": "SUCCESS",
  "data": [
    {
      "id": "66d9a5b2c8f1234567890abc",
      "wasteType": "ELECTRONICS",
      "weight": 3.2,
      "quantity": 1,
      "unit": "KG",
      "condition": "USED",
      "hasPackaging": true,
      "discardDate": "2025-09-10T15:30:00.000Z",
      "status": "AVAILABLE",
      "additionalDescription": "Notebook Dell Inspiron",
      "images": ["data:image/jpeg;base64,..."],
      "userId": "66d8f4a2c8f1234567890xyz",
      "addressId": "66d9a1b2c8f1234567890def",
      "address": {
        "id": "66d9a1b2c8f1234567890def",
        "street": "Rua das Palmeiras",
        "number": "456",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "05435-020"
      },
      "user": {
        "id": "66d8f4a2c8f1234567890xyz",
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "createdAt": "2025-09-06T12:00:00.000Z",
      "updatedAt": "2025-09-06T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. Buscar Resíduo por ID
**`GET /api/waste/:id`** 🌐

#### Path Parameters
- `id`: ID do resíduo (string)

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Resíduo encontrado",
  "code": "SUCCESS",
  "data": {
    "id": "66d9a5b2c8f1234567890abc",
    "wasteType": "ELECTRONICS",
    "weight": 3.2,
    "quantity": 1,
    "unit": "KG",
    "condition": "USED",
    "hasPackaging": true,
    "discardDate": "2025-09-10T15:30:00.000Z",
    "status": "AVAILABLE",
    "additionalDescription": "Notebook Dell Inspiron",
    "images": ["data:image/jpeg;base64,..."],
    "userId": "66d8f4a2c8f1234567890xyz",
    "addressId": "66d9a1b2c8f1234567890def",
    "address": {
      "id": "66d9a1b2c8f1234567890def",
      "street": "Rua das Palmeiras",
      "number": "456",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "05435-020"
    },
    "user": {
      "id": "66d8f4a2c8f1234567890xyz",
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T12:00:00.000Z"
  }
}
```

#### Response Error (404)
```javascript
{
  "success": false,
  "message": "Resíduo não encontrado",
  "code": "NOT_FOUND"
}
```

---

### 4. Atualizar Resíduo
**`PUT /api/waste/:id`** 🔒

#### Path Parameters
- `id`: ID do resíduo (string)

#### Request Headers
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

#### Request Body (Campos Opcionais)
```javascript
{
  "waste": {
    "wasteType": "PLASTIC",              // ENUM (opcional)
    "weight": 2.5,                       // number (opcional)
    "quantity": 5,                       // number (opcional)
    "unit": "UNITS",                     // ENUM (opcional)
    "condition": "NEW",                  // ENUM (opcional)
    "hasPackaging": false,               // boolean (opcional)
    "discardDate": "2025-09-15T10:00:00.000Z", // ISO string (opcional)
    "additionalDescription": "Garrafas PET limpas", // string (opcional)
    "images": [                          // array (opcional)
      "data:image/jpeg;base64,..."
    ]
  }
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Resíduo atualizado com sucesso",
  "code": "SUCCESS",
  "data": {
    // Objeto completo do resíduo atualizado
    "id": "66d9a5b2c8f1234567890abc",
    "wasteType": "PLASTIC",
    "weight": 2.5,
    // ... outros campos atualizados
    "updatedAt": "2025-09-06T14:30:00.000Z"
  }
}
```

#### Response Error (403)
```javascript
{
  "success": false,
  "message": "Não autorizado a atualizar este resíduo",
  "code": "FORBIDDEN"
}
```

#### Response Error (404)
```javascript
{
  "success": false,
  "message": "Resíduo não encontrado",
  "code": "NOT_FOUND"
}
```

---

### 5. Deletar Resíduo
**`DELETE /api/waste/:id`** 🔒

#### Path Parameters
- `id`: ID do resíduo (string)

#### Request Headers
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Resíduo deletado com sucesso",
  "code": "SUCCESS"
}
```

#### Response Error (403)
```javascript
{
  "success": false,
  "message": "Não autorizado a deletar este resíduo",
  "code": "FORBIDDEN"
}
```

#### Response Error (404)
```javascript
{
  "success": false,
  "message": "Resíduo não encontrado",
  "code": "NOT_FOUND"
}
```

---

## 📱 Exemplos de Integração Frontend

### JavaScript/TypeScript

#### 1. Criar Resíduo
```javascript
const createWaste = async (wasteData, addressData, token) => {
  try {
    const response = await fetch('/api/waste', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        waste: wasteData,
        address: addressData
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Resíduo criado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao criar resíduo:', error);
    throw error;
  }
};
```

#### 2. Buscar Resíduos Disponíveis
```javascript
const getAvailableWastes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.wasteType) queryParams.append('wasteType', filters.wasteType);
    if (filters.condition) queryParams.append('condition', filters.condition);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`/api/waste/available?${queryParams}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao buscar resíduos:', error);
    throw error;
  }
};
```

#### 3. Atualizar Resíduo
```javascript
const updateWaste = async (wasteId, updateData, token) => {
  try {
    const response = await fetch(`/api/waste/${wasteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        waste: updateData
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar resíduo:', error);
    throw error;
  }
};
```

#### 4. Deletar Resíduo
```javascript
const deleteWaste = async (wasteId, token) => {
  try {
    const response = await fetch(`/api/waste/${wasteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao deletar resíduo:', error);
    throw error;
  }
};
```

---

## 🎯 Tipos TypeScript

```typescript
// Enums
export enum WasteType {
  ELECTRONICS = 'ELECTRONICS',
  ORGANIC = 'ORGANIC',
  PLASTIC = 'PLASTIC',
  PAPER = 'PAPER',
  GLASS = 'GLASS',
  METAL = 'METAL',
  WOOD = 'WOOD',
  TEXTILE = 'TEXTILE',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

export enum UnitType {
  KG = 'KG',
  LITERS = 'LITERS',
  UNITS = 'UNITS'
}

export enum ConditionType {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED'
}

export enum WasteStatus {
  AVAILABLE = 'AVAILABLE',
  REQUESTED = 'REQUESTED',
  COLLECTED = 'COLLECTED'
}

// Interfaces
export interface CreateWasteRequest {
  waste: {
    wasteType: WasteType;
    weight: number;
    quantity: number;
    unit: UnitType;
    condition: ConditionType;
    hasPackaging: boolean;
    discardDate: string;
    additionalDescription?: string;
    images?: string[];
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
    main?: boolean;
  };
}

export interface WasteResponse {
  id: string;
  wasteType: WasteType;
  weight: number;
  quantity: number;
  unit: UnitType;
  condition: ConditionType;
  hasPackaging: boolean;
  discardDate: string;
  status: WasteStatus;
  additionalDescription?: string;
  images?: string[];
  userId: string;
  addressId: string;
  address?: AddressResponse;
  user?: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## ⚠️ Códigos de Erro Comuns

| Código HTTP | Código API | Descrição |
|-------------|------------|-----------|
| `400` | `VALIDATION_ERROR` | Dados de entrada inválidos |
| `401` | `UNAUTHORIZED` | Token JWT inválido ou ausente |
| `403` | `FORBIDDEN` | Usuário não autorizado para esta ação |
| `404` | `NOT_FOUND` | Recurso não encontrado |
| `500` | `INTERNAL_ERROR` | Erro interno do servidor |

---

## 📝 Notas Importantes

1. **Autenticação**: Sempre inclua o token JWT válido nos headers das requisições protegidas
2. **Formato de Data**: Use sempre o formato ISO 8601 (`YYYY-MM-DDTHH:MM:SS.sssZ`)
3. **Imagens**: Envie as imagens como strings base64 com prefixo de tipo de mídia
4. **Validação**: A API valida todos os enums rigorosamente
5. **Propriedade**: Usuários só podem atualizar/deletar seus próprios resíduos
6. **Endereços**: Se o endereço não existir, será criado automaticamente

---

**Última atualização:** 6 de Setembro de 2025
**Versão da API:** 1.0
