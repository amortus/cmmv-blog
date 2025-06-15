# Configuração da SmartBets API Local

## 🎯 **Solução Recomendada: API Local**

Baseado na pesquisa, a melhor solução é executar a SmartBets API localmente. Isso te dará controle total e credenciais próprias.

## 📋 **Pré-requisitos**

- Python 3.9 ou superior
- pip (gerenciador de pacotes Python)

## 🚀 **Instalação e Configuração**

### **1. Instalar Python (se necessário)**
```bash
# Verificar se Python está instalado
python --version
# ou
python3 --version
```

### **2. Instalar a SmartBets API**
```bash
# Instalar via pip
pip install smartbetsAPI

# Ou instalar com dependências da API
pip install "smartbetsapi[api]"
```

### **3. Executar a API Local**
```bash
# Executar com sua própria senha
smartbetsAPI minhasenha123

# A API estará disponível em:
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

### **4. Configurar no Sistema CMMV**

No painel administrativo, configure:

- **URL da API**: `http://localhost:8000`
- **Password**: `minhasenha123` (ou a senha que você definiu)
- **Username**: `API` (padrão do sistema)

## 🔧 **Configurações Avançadas**

### **Personalizar Configurações**
```bash
# Executar com configurações customizadas
smartbetsAPI minhasenha123 --port 8080 --host 0.0.0.0

# Parâmetros disponíveis:
# --port: Porta (padrão: 8000)
# --host: Host (padrão: localhost)
# --username: Username (padrão: API)
# --debug: Modo debug
# --log: Habilitar logs
```

### **Exemplo de Uso Completo**
```bash
# API rodando em porta customizada com logs
smartbetsAPI minhaSenhaSegura123 --port 8080 --log --debug
```

## 📊 **Testando a API Local**

### **1. Verificar Status**
```bash
curl http://localhost:8000/status
```

### **2. Obter Token**
```bash
curl -X POST http://localhost:8000/v1/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=API&password=minhasenha123"
```

### **3. Fazer Predição**
```bash
# Usar o token obtido acima
curl -X POST http://localhost:8000/v1/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"home": "Flamengo", "away": "Palmeiras", "net": false}'
```

## ⚙️ **Configuração no Sistema**

### **1. Atualizar Configurações**
No painel admin do seu sistema:

1. Vá para **Settings > Football Predictions**
2. Configure:
   - **URL da API**: `http://localhost:8000`
   - **Password**: `minhasenha123`
   - **Competição**: `Campeonato Brasileiro Série A`

### **2. Verificar Funcionamento**
- O painel de informações da API deve mostrar **🟢 API REAL**
- Os logs devem mostrar conexão bem-sucedida
- As predições devem vir da API real

## 🔄 **Automatização (Opcional)**

### **Script de Inicialização**
Criar um script para iniciar a API automaticamente:

```bash
#!/bin/bash
# start_smartbets_api.sh

echo "🚀 Iniciando SmartBets API..."
smartbetsAPI minhasenha123 --port 8000 --log

echo "✅ API disponível em http://localhost:8000"
echo "📚 Documentação em http://localhost:8000/docs"
```

### **Executar como Serviço (Linux/Mac)**
```bash
# Tornar executável
chmod +x start_smartbets_api.sh

# Executar em background
nohup ./start_smartbets_api.sh &
```

## 🎯 **Vantagens da API Local**

1. **Controle Total**: Você define as credenciais
2. **Sem Dependências Externas**: Não depende de serviços terceiros
3. **Performance**: Latência mínima (localhost)
4. **Customização**: Pode modificar configurações conforme necessário
5. **Gratuito**: Sem custos de API externa

## 🚨 **Considerações de Produção**

### **Para Ambiente de Produção:**
- Use uma senha forte e segura
- Configure firewall adequadamente
- Considere usar HTTPS com certificado SSL
- Implemente monitoramento e logs

### **Configuração de Produção:**
```bash
# Exemplo para produção
smartbetsAPI senhaSeguraProducao123 \
  --port 8000 \
  --host 0.0.0.0 \
  --log \
  --level 20
```

## 📞 **Suporte**

Se encontrar problemas:

1. **Verificar logs** da API
2. **Consultar documentação**: http://localhost:8000/docs
3. **GitHub Issues**: https://github.com/Simatwa/smartbetsAPI/issues
4. **Contato**: simatwacaleb@proton.me

## 🎉 **Resultado Esperado**

Após a configuração, seu sistema deve mostrar:
- **Status**: 🟢 API REAL
- **URL**: http://localhost:8000
- **Dados**: Predições reais da SmartBets API
- **Performance**: Resposta rápida e confiável 