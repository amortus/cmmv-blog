#!/bin/bash

# 🚀 INSTALAÇÃO SMARTBETS API - SERVIDOR SSH
# Execute estes comandos no seu servidor: ssh root@45.92.8.73

echo "🚀 Iniciando instalação da SmartBets API..."

# 1. Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependências
echo "🔧 Instalando dependências..."
apt install -y python3 python3-pip curl wget git htop nano ufw

# 3. Verificar Python
echo "🐍 Verificando Python..."
python3 --version
pip3 --version

# 4. Instalar SmartBets API
echo "⚽ Instalando SmartBets API..."
pip3 install smartbetsAPI

# 5. Criar diretório
echo "📁 Criando diretório da API..."
mkdir -p /opt/smartbets-api
cd /opt/smartbets-api

# 6. Criar arquivo de configuração
echo "⚙️ Criando configuração..."
cat > config.env << 'EOF'
API_PASSWORD=futebol123
API_PORT=8080
API_HOST=0.0.0.0
API_USERNAME=API
EOF

# 7. Criar script de inicialização
echo "📝 Criando script de inicialização..."
cat > start_api.sh << 'EOF'
#!/bin/bash

# Carregar configurações
source /opt/smartbets-api/config.env

echo "🚀 Iniciando SmartBets API..."
echo "📍 Porta: $API_PORT"
echo "🔑 Senha: $API_PASSWORD"
echo "🌐 Host: $API_HOST"

# Iniciar API
smartbetsAPI $API_PASSWORD --port $API_PORT --host $API_HOST --log

echo "✅ API iniciada com sucesso!"
echo "🌐 Disponível em: http://45.92.8.73:$API_PORT"
EOF

# 8. Tornar executável
chmod +x start_api.sh

# 9. Criar serviço systemd
echo "🔧 Criando serviço systemd..."
cat > /etc/systemd/system/smartbets-api.service << 'EOF'
[Unit]
Description=SmartBets API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/smartbets-api
ExecStart=/opt/smartbets-api/start_api.sh
Restart=always
RestartSec=10
Environment=PATH=/usr/local/bin:/usr/bin:/bin
EnvironmentFile=/opt/smartbets-api/config.env

[Install]
WantedBy=multi-user.target
EOF

# 10. Ativar serviço
echo "🎯 Ativando serviço..."
systemctl daemon-reload
systemctl enable smartbets-api
systemctl start smartbets-api

# 11. Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 8080
ufw --force enable

# 12. Verificar status
echo "✅ Verificando status..."
systemctl status smartbets-api --no-pager

# 13. Testar API
echo "🧪 Testando API..."
sleep 5

# Teste de status
echo "📊 Testando status..."
curl -s http://localhost:8080/status || echo "❌ Status não disponível"

# Teste de autenticação
echo "🔑 Testando autenticação..."
curl -X POST http://localhost:8080/v1/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=API&password=futebol123" || echo "❌ Auth falhou"

echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA!"
echo ""
echo "📋 RESUMO:"
echo "- API rodando na porta: 8080"
echo "- URL externa: http://45.92.8.73:8080"
echo "- Senha: futebol123"
echo "- Serviço: smartbets-api"
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "- Ver status: systemctl status smartbets-api"
echo "- Ver logs: journalctl -u smartbets-api -f"
echo "- Reiniciar: systemctl restart smartbets-api"
echo "- Parar: systemctl stop smartbets-api"
echo ""
echo "🌐 PRÓXIMO PASSO:"
echo "Configure no admin do blog:"
echo "URL da API: http://45.92.8.73:8080"
echo "Senha: futebol123"
echo "" 