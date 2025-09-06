# 🔗 Exemplo de Rota Completa - GET /api/waste/available

## 📍 **Rota com Valores Reais**

### **URL Base:**
```
http://localhost:3004/api/waste/available
```

### **Exemplo 1: Busca Básica**
```
http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São Paulo&page=1&limit=10
```

### **Exemplo 2: Busca Detalhada**
```
http://localhost:3004

```

### **Exemplo 3: Busca com Todos os Parâmetros**
```
http://localhost:3004/api/waste/available?wasteType=PAPER&location=Rio de Janeiro&condition=USED&page=2&limit=20
```

---

## 📋 **Parâmetros Explicados**

### **wasteType** (obrigatório)
- ✅ `ELECTRONICS` - Eletrônicos
- ✅ `PAPER` - Papel
- ✅ `PLASTIC` - Plástico
- ✅ `GLASS` - Vidro
- ✅ `METAL` - Metal
- ✅ `ORGANIC` - Orgânico
- ✅ `TEXTILE` - Têxtil
- ✅ `WOOD` - Madeira
- ✅ `BATTERY` - Bateria
- ✅ `OIL` - Óleo

### **location** (obrigatório)
- ✅ `São Paulo`
- ✅ `Rio de Janeiro`
- ✅ `Belo Horizonte`
- ✅ `Curitiba`
- ✅ `Porto Alegre`

### **condition** (opcional)
- ✅ `NEW` - Novo
- ✅ `USED` - Usado
- ✅ `DAMAGED` - Danificado

> ⚠️ **IMPORTANTE**: O valor `GOOD` não existe no sistema. Use `NEW` ou `USED` em seu lugar.

### **page** (opcional)
- ✅ Números inteiros: `1`, `2`, `3`, etc.
- ❌ Evitar decimais como `6226.576183065782`

### **limit** (opcional)
- ✅ Números inteiros: `5`, `10`, `20`, `50`
- ❌ Evitar decimais como `6226.576183065782`

---

## 🎯 **Exemplos Práticos para Testes**

### **1. Buscar Eletrônicos em SP:**
```
http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São%20Paulo&page=1&limit=10
```

### **2. Buscar Papel no RJ em Estado Usado:**
```
http://localhost:3004/api/waste/available?wasteType=PAPER&location=Rio%20de%20Janeiro&condition=USED&page=1&limit=15
```

### **3. Buscar Plásticos Usados em BH:**
```
http://localhost:3004/api/waste/available?wasteType=PLASTIC&location=Belo%20Horizonte&condition=USED&page=2&limit=8
```

### **3. Buscar Vidros Novos em Curitiba:**
```
http://localhost:3004/api/waste/available?wasteType=GLASS&location=Curitiba&condition=NEW&page=1&limit=12
```

---

## 🛠️ **Como Usar no Frontend**

### **JavaScript/Fetch:**
```javascript
const baseUrl = 'http://localhost:3004';
const params = new URLSearchParams({
  wasteType: 'ELECTRONICS',
  location: 'São Paulo',
  condition: 'USED',
  page: '1',
  limit: '10'
});

const url = `${baseUrl}/api/waste/available?${params}`;

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### **cURL:**
```bash
curl -X GET "http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São%20Paulo&condition=USED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ⚠️ **Dicas Importantes**

1. **Espaços na URL**: Use `%20` ou `+` para espaços em `location`
   - ✅ `São%20Paulo` ou `São+Paulo`
   - ❌ `São Paulo`

2. **Valores Numéricos**: Use números inteiros para `page` e `limit`
   - ✅ `page=1&limit=10`
   - ❌ `page=6226.576183065782`

3. **Case Sensitive**: Os valores de enum são em MAIÚSCULAS
   - ✅ `wasteType=ELECTRONICS`
   - ❌ `wasteType=electronics`

4. **Autenticação**: Não esqueça do JWT token no header

---

## 📊 **Resposta Esperada**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "66db123456789abcdef01234",
        "waste": {
          "wasteType": "ELECTRONICS",
          "weight": 2.5,
          "condition": "USED",
          "additionalDescription": "Smartphone em bom estado"
        },
        "address": {
          "city": "São Paulo",
          "neighborhood": "Centro",
          "street": "Rua das Flores"
        },
        "createdAt": "2025-09-06T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10
    }
  }
}
```

**🎉 Use esses exemplos para testar a API de forma eficiente!**
