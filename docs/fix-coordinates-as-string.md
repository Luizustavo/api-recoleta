# 🔧 Fix: Coordenadas como String no Banco de Dados

## 📋 Resumo da Alteração

**Problema resolvido:** Erro `Invalid latitude: must be a valid number` ao tentar criar waste, causado pela tentativa de conversão de coordenadas null para Float no Prisma.

**Solução implementada:** Armazenar coordenadas como string no banco de dados e converter para número apenas quando necessário para cálculos matemáticos.

## 🛠️ Mudanças Implementadas

### 1. Schema do Prisma
```prisma
model Address {
  // ANTES:
  longitude Float
  latitude  Float
  
  // DEPOIS:
  longitude String  
  latitude  String
}
```

### 2. Entidade Address
```typescript
interface Props {
  // ANTES:
  longitude?: number
  latitude?: number
  
  // DEPOIS: 
  longitude?: string
  latitude?: string
}
```

### 3. DTOs Atualizados
- `AddressDto`: coordenadas como `string`
- `CreateAddressDto`: coordenadas como `string`
- `UpdateAddressDto`: coordenadas como `string`

### 4. Mapper Simplificado
```typescript
// ANTES: Conversão no mapper
longitude: parseCoordinate(request.longitude, 'longitude'),
latitude: parseCoordinate(request.latitude, 'latitude'),

// DEPOIS: Sem conversão
longitude: request.longitude,
latitude: request.latitude,
```

### 5. Validação Mantida
- Validador `@IsCoordinate()` continua funcionando
- Valida formato string e limites numéricos
- Não converte para número

### 6. Nova Utility para Cálculos
```typescript
// src/application/utils/coordinate.utils.ts

// Converte string para número apenas quando necessário
coordinateToNumber(coordinate: string, type: 'latitude' | 'longitude'): number

// Calcula distância entre dois pontos (aceita strings)
calculateDistance(lat1: string, lng1: string, lat2: string, lng2: string): number
```

## ✅ Benefícios

1. **Sem erros Prisma**: Elimina conversões problemáticas de null para Float
2. **Flexibilidade**: Mantém precisão original das coordenadas
3. **Performance**: Conversão apenas quando necessária
4. **Compatibilidade**: Validação funciona normalmente
5. **Simplicidade**: Menos conversões desnecessárias

## 📊 Fluxo de Dados

```
Frontend (string) 
    ↓ 
Validação (@IsCoordinate - valida formato)
    ↓
Banco MongoDB (string)
    ↓
Cálculos matemáticos (converte para number)
```

## 🗃️ Migração do Banco

Para bancos com dados existentes, execute:

```javascript
// MongoDB Shell
db.Address.find().forEach(function(doc) {
  if (doc.latitude !== null && doc.longitude !== null) {
    db.Address.updateOne(
      { _id: doc._id },
      { 
        $set: { 
          latitude: doc.latitude.toString(),
          longitude: doc.longitude.toString()
        }
      }
    );
  }
});
```

## 🔍 Exemplo de Uso

```typescript
// 1. Armazenamento (como string)
const address = {
  latitude: "-23.5505",
  longitude: "-46.6333"
}

// 2. Cálculo de distância (converte automaticamente)
const distance = calculateDistance(
  address1.latitude, address1.longitude,
  address2.latitude, address2.longitude
)

// 3. Validação manual
const { isValid, errors } = validateCoordinateFormat(
  address.latitude, 
  address.longitude
)
```

## 🚀 Status

✅ **Implementado:**
- Schema atualizado para String
- Entidades e DTOs atualizados  
- Mappers simplificados
- Utilities para cálculos
- Validação funcionando
- Use-cases atualizados

✅ **Testado:**
- Compilação TypeScript sem erros
- Validação de coordenadas
- Sistema funcional

---

**Data:** 6 de Setembro de 2025  
**Versão:** 1.0  
**Status:** ✅ Concluído
