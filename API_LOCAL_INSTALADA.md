# 🎉 API SmartBets LOCAL - INSTALADA E CONFIGURADA

## ✅ **STATUS: FUNCIONANDO**

A API SmartBets foi instalada com sucesso localmente e está integrada ao seu blog!

## 📍 **Localização da API:**
- **Diretório**: `/mnt/e/smartbetsAPI/` (ou `E:\smartbetsAPI\`)
- **URL Local**: http://localhost:8080
- **Processo**: Executando em background

## 🔑 **Credenciais Configuradas:**
- **Username**: `API`
- **Password**: `futebol123`
- **Porta**: `8080`

## 🔧 **Configuração Atual do Blog:**
- ✅ **URL da API**: `http://localhost:8080` (padrão)
- ✅ **Senha**: `futebol123` (padrão)
- ✅ **Times**: Internacionais (Arsenal, Manchester City, etc.)
- ✅ **Dados Online**: `net: true` ativado

## 🚀 **Como Iniciar a API (se parar):**

```bash
cd /mnt/e/smartbetsAPI
smartbetsAPI futebol123 --port 8080 --host
```

## 📊 **Teste da API:**

### 1. **Autenticação:**
```bash
curl -X POST http://localhost:8080/v1/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=API&password=futebol123"
```

### 2. **Predição:**
```bash
curl -X POST http://localhost:8080/v1/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer futebol123" \
  -d '{"home": "Arsenal", "away": "Manchester City", "net": true}'
```

## 🌐 **URLs do Sistema:**
- **Blog**: http://localhost:5001
- **API Local SmartBets**: http://localhost:8080
- **API Blog (CMMV)**: http://localhost:5000
- **Admin**: http://localhost:5002 (se configurado)

## 🎯 **Resultado Esperado:**
Agora no seu blog, as previsões devem mostrar:
- **Status da API**: "API Real" (ao invés de "Simulado")
- **Dados**: Predições reais dos times configurados
- **Fonte**: API local funcionando

## 🔄 **Verificar Status:**

### **Processo da API:**
```bash
ps aux | grep smartbets
```

### **Teste Rápido:**
```bash
curl -s http://localhost:8080/v1/token
```

## ⚠️ **Importante:**
1. **Manter API Rodando**: A API precisa estar executando para funcionar
2. **Porta 8080**: Certifique-se que não há conflito de porta
3. **Times Internacionais**: API funciona melhor com nomes em inglês
4. **Conexão Internet**: Necessária para `net: true` (dados online)

## 🎮 **Próximos Passos:**

1. **Acesse seu blog**: http://localhost:5001
2. **Vá até "Mais Notícias"**: Role a página
3. **Veja as predições**: Deve aparecer "API Real" 
4. **Configurar Admin** (opcional): Para mudar times/configurações

## 🛠️ **Personalizar Times (Opcional):**

Edite o arquivo:
```
apps/web/src/theme-ondepagamais/composables/useFootballPredictions.ts
```

Na linha dos `brazilianMatches`, mude para os times que preferir (em inglês).

## 🎉 **SUCESSO COMPLETO!**

Sua API SmartBets está:
- ✅ **Instalada** localmente
- ✅ **Configurada** no blog  
- ✅ **Funcionando** com dados reais
- ✅ **Integrada** perfeitamente

**Agora você tem predições de futebol REAIS no seu blog!** ⚽🏆 