# 🚀 Instalação da SmartBets API no Servidor SSH

## 📋 **Informações do Servidor**
- **IP**: 45.92.8.73
- **Usuário**: root
- **Conexão**: SSH

## 🔧 **Passo a Passo da Instalação**

### **1. Conectar no Servidor**
```bash
ssh root@45.92.8.73
```

### **2. Atualizar Sistema (Ubuntu/Debian)**
```bash
# Atualizar pacotes
apt update && apt upgrade -y

# Instalar dependências básicas
apt install -y python3 python3-pip curl wget git htop nano
```

### **3. Verificar Python**
```bash
# Verificar versão do Python
python3 --version

# Verificar pip
pip3 --version

# Se necessário, instalar pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
```

### **4. Instalar SmartBets API**
```bash
# Instalar via pip
pip3 install smartbetsAPI

# Ou com dependências completas
pip3 install "smartbetsapi[api]"
```

### **5. Criar Diretório para a API**
```bash
# Criar diretório
mkdir -p /opt/smartbets-api
cd /opt/smartbets-api

# Criar arquivo de configuração
nano config.env
```

### **6. Configurar Variáveis (config.env)**
```bash
# Adicionar no arquivo config.env:
API_PASSWORD=futebol123
API_PORT=8080
API_HOST=0.0.0.0
API_USERNAME=API
```

### **7. Criar Script de Inicialização**
```bash
# Criar script
nano /opt/smartbets-api/start_api.sh
```

**Conteúdo do start_api.sh:**
```bash
#!/bin/bash

# Carregar configurações
source /opt/smartbets-api/config.env

echo "🚀 Iniciando SmartBets API..."
echo "📍 Porta: $API_PORT"
echo "🔑 Senha: $API_PASSWORD"

# Iniciar API
smartbetsAPI $API_PASSWORD --port $API_PORT --host $API_HOST --log

echo "✅ API iniciada com sucesso!"
echo "🌐 Disponível em: http://45.92.8.73:$API_PORT"
```

### **8. Tornar Script Executável**
```bash
chmod +x /opt/smartbets-api/start_api.sh
```

### **9. Testar a API**
```bash
# Executar em modo teste
/opt/smartbets-api/start_api.sh
```

### **10. Configurar como Serviço (Opcional)**
```bash
# Criar arquivo de serviço
nano /etc/systemd/system/smartbets-api.service
```

**Conteúdo do smartbets-api.service:**
```ini
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
```

### **11. Ativar Serviço**
```bash
# Recarregar systemd
systemctl daemon-reload

# Ativar serviço
systemctl enable smartbets-api

# Iniciar serviço
systemctl start smartbets-api

# Verificar status
systemctl status smartbets-api
```

## 🔥 **Configurar Firewall**

### **Abrir Porta 8080**
```bash
# UFW (Ubuntu)
ufw allow 8080
ufw reload

# Ou iptables
iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
iptables-save
```

## 🧪 **Testar a API**

### **1. Teste Local (no próprio servidor)**
```bash
# Teste de status
curl http://localhost:8080/status

# Teste de autenticação
curl -X POST http://localhost:8080/v1/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=API&password=futebol123"
```

### **2. Teste Externo (do seu computador)**
```bash
# Teste de status
curl http://45.92.8.73:8080/status

# Teste de autenticação
curl -X POST http://45.92.8.73:8080/v1/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=API&password=futebol123"
```

## ⚙️ **Configurar no Blog CMMV**

Depois da API funcionando, configure no admin do blog:

1. **Vá para Admin > Settings > Advertising**
2. **Configure Football Predictions:**
   - ✅ **Habilitar Football Predictions**: ON
   - **URL da API**: `http://45.92.8.73:8080`
   - **Senha da API**: `futebol123`
   - **Competição**: `Campeonato Brasileiro Série A`

## 🔍 **Monitoramento**

### **Verificar Logs da API**
```bash
# Logs do serviço
journalctl -u smartbets-api -f

# Verificar processos
ps aux | grep smartbets

# Verificar porta
netstat -tulpn | grep 8080
```

### **Restart da API**
```bash
# Reiniciar via systemctl
systemctl restart smartbets-api

# Ou parar e iniciar manualmente
systemctl stop smartbets-api
/opt/smartbets-api/start_api.sh
```

## 🔒 **Segurança (Recomendado)**

### **1. Mudar Senha Padrão**
```bash
# Editar config.env
nano /opt/smartbets-api/config.env

# Mudar para senha mais segura
API_PASSWORD=MinhaS3nh4S3gur4!123
```

### **2. Configurar SSL/HTTPS (Opcional)**
```bash
# Instalar Nginx
apt install nginx

# Configurar proxy reverso
nano /etc/nginx/sites-available/smartbets-api
```

## 📞 **Comandos Úteis**

```bash
# Status da API
systemctl status smartbets-api

# Reiniciar API
systemctl restart smartbets-api

# Ver logs em tempo real
journalctl -u smartbets-api -f

# Testar conectividade
curl -I http://45.92.8.73:8080/status

# Verificar porta aberta
nmap -p 8080 45.92.8.73
```

## 🎯 **Resultado Esperado**

Após a instalação completa:

- ✅ **API rodando**: http://45.92.8.73:8080
- ✅ **Serviço ativo**: `systemctl status smartbets-api`
- ✅ **Blog configurado**: URL apontando para servidor
- ✅ **Predições reais**: Dados da SmartBets API

## 🚨 **Troubleshooting**

### **API não inicia:**
```bash
# Verificar instalação
pip3 show smartbetsAPI

# Reinstalar se necessário
pip3 uninstall smartbetsAPI
pip3 install smartbetsAPI
```

### **Porta bloqueada:**
```bash
# Verificar firewall
ufw status
iptables -L

# Abrir porta
ufw allow 8080
```

### **Erro de permissão:**
```bash
# Verificar permissões
ls -la /opt/smartbets-api/
chmod +x /opt/smartbets-api/start_api.sh
```

## 🎉 **Próximos Passos**

1. **Conectar no servidor**: `ssh root@45.92.8.73`
2. **Seguir instalação**: Passo a passo acima
3. **Testar API**: Verificar se responde
4. **Configurar blog**: Apontar para IP do servidor
5. **Monitorar**: Verificar funcionamento

**Quer que eu te ajude com algum passo específico?** 🚀 