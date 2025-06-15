#!/bin/bash

# 🧪 TESTE DA API SMARTBETS NO SERVIDOR
# Execute este script no seu computador local para testar a API no servidor

echo "🧪 Testando SmartBets API no servidor 45.92.8.73:8080..."

# 1. Teste de conectividade básica
echo "🔌 Testando conectividade..."
if ping -c 3 45.92.8.73 >/dev/null 2>&1; then
    echo "✅ Servidor está acessível"
else
    echo "❌ Servidor não está acessível"
    exit 1
fi

# 2. Teste de porta
echo "🔍 Testando porta 8080..."
if nc -z -w3 45.92.8.73 8080 2>/dev/null; then
    echo "✅ Porta 8080 está aberta"
else
    echo "❌ Porta 8080 não está acessível"
    echo "💡 Verifique se a API está rodando e o firewall permite a porta 8080"
fi

# 3. Teste de status da API
echo "📊 Testando endpoint /status..."
STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" http://45.92.8.73:8080/status 2>/dev/null)
STATUS_CODE=$(echo "$STATUS_RESPONSE" | tail -n1)
STATUS_BODY=$(echo "$STATUS_RESPONSE" | head -n -1)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ API Status: OK"
    echo "📋 Resposta: $STATUS_BODY"
else
    echo "❌ API Status falhou (HTTP $STATUS_CODE)"
    echo "📋 Resposta: $STATUS_BODY"
fi

# 4. Teste de autenticação
echo "🔑 Testando autenticação..."
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://45.92.8.73:8080/v1/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password&username=API&password=futebol123" 2>/dev/null)

AUTH_CODE=$(echo "$AUTH_RESPONSE" | tail -n1)
AUTH_BODY=$(echo "$AUTH_RESPONSE" | head -n -1)

if [ "$AUTH_CODE" = "200" ]; then
    echo "✅ Autenticação: OK"
    echo "🔑 Token obtido com sucesso"
    
    # Extrair token do JSON
    TOKEN=$(echo "$AUTH_BODY" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "🎫 Token: ${TOKEN:0:20}..."
    
    # 5. Teste de predição
    echo "🔮 Testando predição..."
    PREDICT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://45.92.8.73:8080/v1/predict \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"home": "Arsenal", "away": "Manchester City", "net": false}' 2>/dev/null)
    
    PREDICT_CODE=$(echo "$PREDICT_RESPONSE" | tail -n1)
    PREDICT_BODY=$(echo "$PREDICT_RESPONSE" | head -n -1)
    
    if [ "$PREDICT_CODE" = "200" ]; then
        echo "✅ Predição: OK"
        echo "⚽ Resultado: $PREDICT_BODY"
    else
        echo "❌ Predição falhou (HTTP $PREDICT_CODE)"
        echo "📋 Resposta: $PREDICT_BODY"
    fi
    
else
    echo "❌ Autenticação falhou (HTTP $AUTH_CODE)"
    echo "📋 Resposta: $AUTH_BODY"
fi

# 6. Teste de documentação
echo "📚 Testando documentação..."
DOCS_RESPONSE=$(curl -s -w "\n%{http_code}" http://45.92.8.73:8080/docs 2>/dev/null)
DOCS_CODE=$(echo "$DOCS_RESPONSE" | tail -n1)

if [ "$DOCS_CODE" = "200" ]; then
    echo "✅ Documentação: OK"
    echo "🌐 Acesse: http://45.92.8.73:8080/docs"
else
    echo "❌ Documentação não acessível (HTTP $DOCS_CODE)"
fi

echo ""
echo "🎯 RESUMO DO TESTE:"
echo "- Servidor: 45.92.8.73"
echo "- Porta: 8080"
echo "- Status API: $([ "$STATUS_CODE" = "200" ] && echo "✅ OK" || echo "❌ FALHA")"
echo "- Autenticação: $([ "$AUTH_CODE" = "200" ] && echo "✅ OK" || echo "❌ FALHA")"
echo "- Predição: $([ "$PREDICT_CODE" = "200" ] && echo "✅ OK" || echo "❌ FALHA")"
echo ""

if [ "$STATUS_CODE" = "200" ] && [ "$AUTH_CODE" = "200" ]; then
    echo "🎉 API FUNCIONANDO PERFEITAMENTE!"
    echo ""
    echo "🔧 Configure no admin do blog:"
    echo "- URL da API: http://45.92.8.73:8080"
    echo "- Senha: futebol123"
    echo "- Habilitar Football Predictions: ON"
else
    echo "⚠️ API COM PROBLEMAS!"
    echo ""
    echo "🔧 RESOLUÇÃO:"
    echo "1. Conecte no servidor: ssh root@45.92.8.73"
    echo "2. Verifique status: systemctl status smartbets-api"
    echo "3. Veja logs: journalctl -u smartbets-api -f"
    echo "4. Reinicie se necessário: systemctl restart smartbets-api"
fi

echo "" 