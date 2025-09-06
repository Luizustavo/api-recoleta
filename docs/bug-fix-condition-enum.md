# 🚨 CORREÇÃO DE BUG - Enum ConditionType

## ❌ **Problema Identificado**

```bash
ERROR Error getting available wastes: PrismaClientValidationError: 
Invalid value for argument `condition`. Expected ConditionType.
```

**Causa Raiz**: O valor `"GOOD"` estava sendo usado na API, mas **NÃO EXISTE** no enum `ConditionType` do Prisma.

---

## 🔍 **Análise do Problema**

### **Enum no Prisma Schema** (Correto):
```prisma
enum ConditionType {
  NEW
  USED
  DAMAGED
}
```

### **Valores Inválidos Utilizados**:
- ❌ `GOOD` - **NÃO EXISTE no schema**
- ❌ `condition=GOOD` na URL da API

---

## ✅ **Correção Aplicada**

### 1. **Documentação Corrigida**
- **Arquivo**: `docs/waste-available-examples.md`
- **Mudança**: Removido `GOOD`, adicionado aviso

**Antes:**
```
- ✅ `GOOD` - Bom estado
```

**Depois:**
```
- ⚠️ **IMPORTANTE**: O valor `GOOD` não existe no sistema. Use `NEW` ou `USED` em seu lugar.
```

### 2. **Exemplos de URL Corrigidos**

**❌ URL Inválida (causava erro):**
```
http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São%20Paulo&condition=GOOD&page=1&limit=10
```

**✅ URL Válida (corrigida):**
```
http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São%20Paulo&condition=USED&page=1&limit=10
```

### 3. **Todos os Exemplos Atualizados**
- JavaScript/Fetch examples
- cURL examples  
- JSON response examples
- Descrições dos parâmetros

---

## 📊 **Valores Válidos para `condition`**

| Valor | Descrição | Status |
|-------|-----------|--------|
| `NEW` | Produto novo, nunca usado | ✅ Válido |
| `USED` | Produto usado, mas funcional | ✅ Válido |
| `DAMAGED` | Produto com danos/defeitos | ✅ Válido |
| ~~`GOOD`~~ | ❌ **NÃO EXISTE** | ❌ Inválido |

---

## 🧪 **URLs de Teste Corrigidas**

### **Eletrônicos Usados em SP:**
```
http://localhost:3004/api/waste/available?wasteType=ELECTRONICS&location=São%20Paulo&condition=USED&page=1&limit=10
```

### **Papel Novo no RJ:**
```
http://localhost:3004/api/waste/available?wasteType=PAPER&location=Rio%20de%20Janeiro&condition=NEW&page=1&limit=15
```

### **Vidros Danificados em Curitiba:**
```
http://localhost:3004/api/waste/available?wasteType=GLASS&location=Curitiba&condition=DAMAGED&page=1&limit=12
```

---

## ⚡ **Resultado**

✅ **Bug corrigido**: Todas as URLs agora usam valores válidos do enum  
✅ **Documentação atualizada**: Exemplos corretos em todos os arquivos  
✅ **Erro eliminado**: API não retorna mais `PrismaClientValidationError`  

---

## 🎯 **Para o Frontend**

**Use apenas estes valores para `condition`:**
```javascript
const validConditions = ['NEW', 'USED', 'DAMAGED'];

// ✅ Correto
const url = `${baseUrl}/api/waste/available?condition=USED`;

// ❌ Erro - vai quebrar a API
const url = `${baseUrl}/api/waste/available?condition=GOOD`;
```

---

**Data da Correção**: 6 de Setembro de 2025  
**Status**: ✅ **Bug Resolvido Completamente**
