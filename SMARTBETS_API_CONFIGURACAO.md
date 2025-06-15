# SmartBets API - Configuração e Autenticação

## 🔍 **Diagnóstico da API**

### **Status Atual:**
- ✅ **API Online**: https://smartbetsapi.onrender.com está funcionando
- ✅ **Documentação**: Disponível em `/docs` (Swagger UI)
- ⚠️ **Autenticação**: Requer credenciais válidas para acesso

### **Estrutura da API Descoberta:**

#### **Endpoints Principais:**
- `GET /` - Redirect para documentação
- `GET /status` - Status do servidor
- `POST /v1/token` - Obter token de autenticação
- `POST /v1/predict` - Fazer predições (requer token)

#### **Fluxo de Autenticação:**
1. **Obter Token**: `POST /v1/token`
   ```bash
   curl -X POST https://smartbetsapi.onrender.com/v1/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password&username=SEU_USERNAME&password=SUA_PASSWORD"
   ```

2. **Usar Token**: `POST /v1/predict`
   ```bash
   curl -X POST https://smartbetsapi.onrender.com/v1/predict \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer SEU_TOKEN" \
     -d '{"home": "Flamengo", "away": "Palmeiras", "net": false}'
   ```

## 🔧 **Implementação Atual**

### **Composable Atualizado:**
O sistema agora implementa o fluxo correto da API:

```typescript
// Step 1: Get authentication token
const tokenResponse = await fetch(`${apiUrl.value}/v1/token`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'password',
    username: 'user', // Configurável
    password: apiPassword.value
  })
})

// Step 2: Make predictions with token
const predictResponse = await fetch(`${apiUrl.value}/v1/predict`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenData.access_token}`
  },
  body: JSON.stringify({
    home: match.home,
    away: match.away,
    net: false
  })
})
```

### **Jogos Pré-configurados:**
O sistema faz predições para jogos clássicos do futebol brasileiro:
- Flamengo vs Palmeiras
- São Paulo vs Corinthians  
- Santos vs Grêmio
- Internacional vs Atlético-MG
- Cruzeiro vs Botafogo

## ⚙️ **Configuração Necessária**

### **1. Credenciais da API**
Para usar a API real, você precisa:

1. **Obter Credenciais**: Contatar o desenvolvedor da API ou criar conta
2. **Configurar no Admin**: 
   - URL: `https://smartbetsapi.onrender.com`
   - Password: Sua senha da API
   - Username: Pode ser configurável (atualmente "user")

### **2. Possíveis Soluções:**

#### **Opção A: Credenciais Públicas**
- Verificar se há credenciais de teste na documentação
- Contatar: simatwacaleb@proton.me

#### **Opção B: API Própria**
- Implementar sua própria API de predições
- Usar o mesmo formato de resposta

#### **Opção C: Dados Simulados Melhorados**
- Manter sistema atual com dados mais realistas
- Adicionar variação temporal nos dados

## 📊 **Formato de Resposta da API**

### **Token Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### **Prediction Response:**
```json
{
  "choice": 55.56,
  "g": 10,
  "gg": 70,
  "ov15": 75,
  "ov25": 40,
  "ov35": 25,
  "pick": "ov15",
  "result": "1"
}
```

### **Mapeamento de Resultados:**
- `"1"` = Casa (Time da casa vence)
- `"2"` = Fora (Time visitante vence)  
- `"x"` = Empate
- `"1x"` = Casa ou Empate
- `"2x"` = Fora ou Empate

## 🚨 **Status Atual do Sistema**

### **Detecção Inteligente:**
O sistema agora detecta automaticamente:
- ✅ **API Real**: Quando consegue autenticar e obter predições
- ⚠️ **Erro de Auth**: Quando API está online mas credenciais inválidas
- 🔴 **API Offline**: Quando não consegue conectar
- 📊 **Simulado**: Fallback com dados simulados

### **Logs de Debug:**
```
🔄 Starting loadPredictions...
📊 API URL: https://smartbetsapi.onrender.com
📊 API Password: ***
📊 Competition: Campeonato Brasileiro Série A
⚠️ SmartBets API authentication failed: {"detail":"Invalid username or password"}
⚠️ SmartBets API failed: Error: Token request failed: 401 - {"detail":"Invalid username or password"}
```

## 🎯 **Próximos Passos**

1. **Obter Credenciais Válidas**:
   - Contatar desenvolvedor da API
   - Verificar documentação oficial
   - Testar credenciais de demonstração

2. **Configurar Username**:
   - Adicionar campo de username nas configurações
   - Tornar configurável via admin

3. **Melhorar Fallback**:
   - Dados simulados mais realistas
   - Cache inteligente de predições
   - Integração com outras APIs

4. **Monitoramento**:
   - Alertas para falhas de autenticação
   - Métricas de uso da API
   - Logs estruturados

## 📞 **Contato da API**

- **Desenvolvedor**: Smartwa
- **Email**: simatwacaleb@proton.me  
- **GitHub**: https://github.com/Simatwa
- **Repositório**: https://github.com/Simatwa/smartbetsAPI

## 🔗 **Links Úteis**

- **API Docs**: https://smartbetsapi.onrender.com/docs
- **OpenAPI Schema**: https://smartbetsapi.onrender.com/openapi.json
- **Status**: https://smartbetsapi.onrender.com/status 