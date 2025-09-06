# 🚀 MELHORIA IMPLEMENTADA - Coordenadas Obrigatórias

## 🎯 **Objetivo da Melhoria**

Tornar **latitude e longitude obrigatórias** no cadastro de resíduos para facilitar o cálculo de proximidade e otimizar a busca de descartes próximos.

---

## ✅ **Mudanças Implementadas**

### 1. **Schema Prisma Atualizado**
**Arquivo**: `prisma/schema.prisma`

**Antes:**
```prisma
model Address {
  longitude Float?  // Opcional
  latitude  Float?  // Opcional
}
```

**Depois:**
```prisma
model Address {
  longitude Float   // Obrigatório
  latitude  Float   // Obrigatório
}
```

### 2. **DTO CreateWaste Atualizado**
**Arquivo**: `src/application/dtos/waste/create-waste.dto.ts`

**Adicionado ao AddressDataDto:**
```typescript
@ApiProperty({
  description: 'Latitude do endereço (obrigatório para cálculo de proximidade)',
  example: -23.5505,
  minimum: -90,
  maximum: 90,
})
@IsNumber()
@Min(-90)
@Max(90)
latitude: number

@ApiProperty({
  description: 'Longitude do endereço (obrigatório para cálculo de proximidade)', 
  example: -46.6333,
  minimum: -180,
  maximum: 180,
})
@IsNumber()
@Min(-180)
@Max(180)
longitude: number
```

### 3. **DTO CreateAddress Atualizado**
**Arquivo**: `src/application/dtos/address/create-address.dto.ts`

**Mudança:**
- `@ApiPropertyOptional` → `@ApiProperty` 
- `longitude?: number` → `longitude: number`
- `latitude?: number` → `latitude: number`
- Adicionadas validações `@Min()` e `@Max()`

### 4. **DTO UpdateAddress Melhorado**
**Arquivo**: `src/application/dtos/address/update-address.dto.ts`

**Adicionado:**
- Validações `@Min(-180)` e `@Max(180)` para longitude
- Validações `@Min(-90)` e `@Max(90)` para latitude
- Limites documentados no Swagger

---

## 🌍 **Validações Implementadas**

### **Latitude**
- **Mínimo**: -90° (Polo Sul)
- **Máximo**: +90° (Polo Norte)
- **Exemplo SP**: -23.5505

### **Longitude**
- **Mínimo**: -180° (Antimeridiano Oeste)
- **Máximo**: +180° (Antimeridiano Leste)
- **Exemplo SP**: -46.6333

### **Coordenadas de Referência (Brasil)**
| Cidade | Latitude | Longitude |
|--------|----------|-----------|
| São Paulo | -23.5505 | -46.6333 |
| Rio de Janeiro | -22.9068 | -43.1729 |
| Belo Horizonte | -19.9167 | -43.9345 |
| Brasília | -15.7942 | -47.8822 |
| Salvador | -12.9714 | -38.5014 |

---

## 📱 **Impacto no Frontend**

### **Antes (Opcional)**
```json
{
  "address": {
    "street": "Rua das Flores",
    "city": "São Paulo"
    // latitude e longitude podiam ser omitidos
  }
}
```

### **Depois (Obrigatório)**
```json
{
  "address": {
    "street": "Rua das Flores", 
    "city": "São Paulo",
    "latitude": -23.5505,    // ← OBRIGATÓRIO
    "longitude": -46.6333    // ← OBRIGATÓRIO
  }
}
```

---

## 🔧 **Exemplos de Request Body**

### **POST /api/waste**
```json
{
  "waste": {
    "wasteType": "ELECTRONICS",
    "weight": 2.5,
    "quantity": 1,
    "unit": "KG",
    "condition": "USED",
    "hasPackaging": true,
    "discardDate": "2025-09-10T10:00:00.000Z",
    "additionalDescription": "Smartphone antigo"
  },
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro", 
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "latitude": -23.5505,    // ← NOVO OBRIGATÓRIO
    "longitude": -46.6333    // ← NOVO OBRIGATÓRIO
  }
}
```

### **POST /api/address**
```json
{
  "street": "Rua Augusta",
  "number": "1000",
  "city": "São Paulo",
  "state": "SP", 
  "zipCode": "01305-100",
  "latitude": -23.5633,     // ← NOVO OBRIGATÓRIO
  "longitude": -46.6568     // ← NOVO OBRIGATÓRIO
}
```

---

## 🚨 **Validações de Erro**

### **Latitude Inválida**
```json
{
  "statusCode": 400,
  "message": [
    "latitude must not be greater than 90",
    "latitude must not be less than -90"
  ],
  "error": "Bad Request"
}
```

### **Longitude Inválida**
```json
{
  "statusCode": 400,
  "message": [
    "longitude must not be greater than 180",
    "longitude must not be less than -180"
  ],
  "error": "Bad Request"
}
```

### **Coordenadas Faltando**
```json
{
  "statusCode": 400,
  "message": [
    "latitude must be a number conforming to the specified constraints",
    "longitude must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

---

## 🎯 **Benefícios da Melhoria**

### ✅ **Para o Sistema**
1. **Busca por Proximidade**: Cálculo preciso de distâncias
2. **Geolocalização**: Localização exata dos resíduos
3. **Otimização de Rotas**: Melhor logística de coleta
4. **Análise Geográfica**: Mapas de calor e estatísticas por região

### ✅ **Para o Usuário**
1. **Encontrar Descartes Próximos**: Lista ordenada por distância
2. **Visualização no Mapa**: Ver resíduos em mapa interativo  
3. **Coleta Eficiente**: Rotas otimizadas para coleta
4. **Experiência Melhorada**: Interface mais intuitiva

---

## 🛠️ **Como Obter Coordenadas**

### **Opção 1: Navigator.geolocation (Recomendado)**
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log(`Lat: ${lat}, Lng: ${lng}`);
  },
  (error) => console.error('Erro ao obter localização:', error)
);
```

### **Opção 2: Google Maps Geocoding API**
```javascript
const geocoder = new google.maps.Geocoder();
geocoder.geocode({ address: "Rua Augusta, 1000, São Paulo" }, 
  (results, status) => {
    if (status === 'OK') {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
    }
  }
);
```

### **Opção 3: Input Manual**
- Permitir que usuário digite coordenadas
- Validar formato e limites
- Fornecer exemplos de cidades principais

---

## 📊 **Status da Implementação**

- ✅ **Schema Prisma**: Atualizado (campos obrigatórios)
- ✅ **DTOs**: Atualizados com validações
- ✅ **Swagger**: Documentação completa com exemplos
- ✅ **Validações**: Min/Max implementadas
- ✅ **TypeScript**: Compilação sem erros
- ✅ **Cliente Prisma**: Regenerado com mudanças

---

## 🚦 **Próximos Passos Sugeridos**

1. **Frontend**: Implementar captura de geolocalização
2. **API de Proximidade**: Criar endpoint para buscar por coordenadas
3. **Mapa Interativo**: Implementar visualização em mapa
4. **Cálculo de Distância**: Função para calcular proximidade entre pontos
5. **Dados Históricos**: Migrar dados existentes (se houver)

---

**Data da Implementação**: 6 de Setembro de 2025  
**Status**: ✅ **Melhoria Implementada com Sucesso**
