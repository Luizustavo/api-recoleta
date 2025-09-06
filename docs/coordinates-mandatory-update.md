# 🚀 ATUALIZAÇÃO DA API - Coordenadas Obrigatórias

## 📍 **Mudança Implementada**

A partir de agora, **latitude e longitude são OBRIGATÓRIOS** no cadastro de resíduos para facilitar:
- 🎯 Cálculo de proximidade entre usuários
- 📍 Geolocalização precisa
- 🗺️ Visualização em mapas
- 🚚 Otimização de rotas de coleta

---

## 🔄 **Antes vs Depois**

### **❌ Antes (Opcional)**
```json
{
  "address": {
    "street": "Rua das Flores",
    "city": "São Paulo",
    "state": "SP"
    // latitude e longitude eram opcionais
  }
}
```

### **✅ Agora (Obrigatório)**
```json
{
  "address": {
    "street": "Rua das Flores", 
    "city": "São Paulo",
    "state": "SP",
    "latitude": -23.5505,    // ← OBRIGATÓRIO
    "longitude": -46.6333    // ← OBRIGATÓRIO
  }
}
```

---

## 📝 **Request Body Completo - POST /api/waste**

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
    "additionalDescription": "Smartphone antigo em bom estado"
  },
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apartamento 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP", 
    "zipCode": "01234-567",
    "reference": "Próximo ao shopping center",
    "main": true,
    "latitude": "-23.5505",     // ← STRING (não number)
    "longitude": "-46.6333"     // ← STRING (não number)
  }
}
```

---

## 📍 **Coordenadas de Referência (Brasil)**

| Cidade | Estado | Latitude | Longitude |
|--------|--------|----------|-----------|
| São Paulo | SP | `"-23.5505"` | `"-46.6333"` |
| Rio de Janeiro | RJ | `"-22.9068"` | `"-43.1729"` |
| Belo Horizonte | MG | `"-19.9167"` | `"-43.9345"` |
| Brasília | DF | `"-15.7942"` | `"-47.8822"` |
| Salvador | BA | `"-12.9714"` | `"-38.5014"` |
| Fortaleza | CE | `"-3.7172"` | `"-38.5433"` |
| Curitiba | PR | `"-25.4284"` | `"-49.2733"` |
| Recife | PE | `"-8.0476"` | `"-34.8770"` |
| Porto Alegre | RS | `"-30.0277"` | `"-51.2287"` |
| Manaus | AM | `"-3.1190"` | `"-60.0217"` |

---

## ⚠️ **Validações Implementadas**

### **Latitude**
- **Mínimo**: -90° (Polo Sul)
- **Máximo**: +90° (Polo Norte)
- **Exemplo**: -23.5505 (São Paulo)

### **Longitude** 
- **Mínimo**: -180° (Antimeridiano Oeste)
- **Máximo**: +180° (Antimeridiano Leste)
- **Exemplo**: -46.6333 (São Paulo)

### **Mensagens de Erro**

**Latitude Inválida:**
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

**Longitude Inválida:**
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

**Coordenadas Faltando:**
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

## 🛠️ **Como Obter Coordenadas no Frontend**

### **1. Geolocalização HTML5 (Recomendado)**
```javascript
function obterCoordenadas() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  });
}

// Uso
try {
  const coords = await obterCoordenadas();
  console.log(`Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
} catch (error) {
  console.error('Erro ao obter coordenadas:', error);
}
```

### **2. Google Maps Geocoding**
```javascript
function geocodificarEndereco(endereco) {
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: endereco }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          latitude: location.lat(),
          longitude: location.lng()
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

// Uso
try {
  const coords = await geocodificarEndereco('Rua Augusta, 1000, São Paulo, SP');
  console.log(`Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
} catch (error) {
  console.error('Erro no geocoding:', error);
}
```

### **3. Input Manual com Validação**
```html
<form>
  <label>Latitude (-90 a +90):</label>
  <input type="number" 
         min="-90" 
         max="90" 
         step="0.000001" 
         placeholder="-23.5505"
         id="latitude" 
         required>
  
  <label>Longitude (-180 a +180):</label>
  <input type="number" 
         min="-180" 
         max="180" 
         step="0.000001" 
         placeholder="-46.6333"
         id="longitude" 
         required>
</form>
```

---

## 🚦 **Endpoints Afetados**

### **✅ Atualizados com Coordenadas Obrigatórias**
- `POST /api/waste` - Criar resíduo
- `POST /api/address` - Criar endereço

### **✅ Mantém Coordenadas Opcionais**
- `PUT /api/waste/:id` - Atualizar resíduo (parcial)
- `PUT /api/address/:id` - Atualizar endereço (parcial)

### **🚀 Novos Recursos Disponíveis**
- Busca por proximidade usando coordenadas
- Cálculo automático de distâncias
- Ordenação por proximidade geográfica

---

## 📊 **Swagger Documentation**

Acesse: `http://localhost:3004/api`

**Novos campos na documentação:**
- ✅ `latitude` marcado como obrigatório
- ✅ `longitude` marcado como obrigatório  
- ✅ Validações Min/Max documentadas
- ✅ Exemplos com coordenadas reais
- ✅ Descrições explicativas sobre uso

---

## ✅ **Checklist de Implementação**

- [x] **Schema Prisma**: Latitude/longitude obrigatórios
- [x] **DTOs**: Atualizados com validações
- [x] **Swagger**: Documentação completa
- [x] **Validações**: Min/Max implementadas
- [x] **TypeScript**: Compilação sem erros
- [x] **Use Case**: Busca por proximidade criado
- [x] **Documentação**: Guias de implementação

---

**🎉 Agora sua API está pronta para funcionalidades baseadas em geolocalização!**

**Data da Atualização**: 6 de Setembro de 2025  
**Status**: ✅ **Implementação Completa**
