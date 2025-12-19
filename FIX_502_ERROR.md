# 🔧 Correção Rápida - Erro 502 Bad Gateway

## 📋 Problema Identificado

Você está recebendo:
- ✗ 502 Bad Gateway em `http://localhost:8000/api/documentation`
- ✗ 502 Bad Gateway em `http://localhost:8000/api/dashboard`
- ✗ Erro CORS no frontend

## 🚀 Solução Imediata

### **PASSO 1: Verificar Status dos Containers**

```bash
docker ps
```

Todos os containers devem estar "Up". Se `estoque-backend` estiver reiniciando constantemente, há um problema.

---

### **PASSO 2: Ver Logs do Backend**

```bash
docker logs estoque-backend --tail 100
```

**Procure por:**
- ✓ `✅ Aplicação pronta!` (significa que iniciou corretamente)
- ✗ Erros de PHP
- ✗ Erros de conexão com banco de dados
- ✗ PHP-FPM não iniciou

---

### **PASSO 3: Ver Logs do Nginx**

```bash
docker logs estoque-nginx --tail 50
```

**Procure por:**
- ✗ `connect() failed (111: Connection refused) while connecting to upstream`
- ✗ `upstream timed out`

---

### **PASSO 4: Testar PHP-FPM Diretamente**

```bash
# Entrar no container do backend
docker exec -it estoque-backend bash

# Verificar se PHP-FPM está rodando
ps aux | grep php-fpm

# Testar se o Laravel responde
php artisan --version

# Sair do container
exit
```

---

### **PASSO 5: Reiniciar Backend e Nginx**

```bash
docker-compose restart backend nginx
```

Aguarde 30-60 segundos e teste novamente:

```bash
curl http://localhost:8000/api/dashboard
```

---

### **PASSO 6: Se Ainda Não Funcionar - Rebuild Completo**

```bash
# Parar tudo
docker-compose down

# Reconstruir imagens
docker-compose build --no-cache backend

# Subir novamente
docker-compose up -d

# Monitorar logs em tempo real
docker-compose logs -f backend
```

**Aguarde até ver:**
```
✅ Aplicação pronta!
📚 Swagger disponível em: http://localhost:8000/api/documentation
🎨 Frontend disponível em: http://localhost:3001

🚀 Iniciando PHP-FPM...
```

---

## 🔍 Diagnóstico Avançado

### Verificar Permissões

```bash
docker exec -it estoque-backend bash
ls -la /var/www/storage
ls -la /var/www/bootstrap/cache
```

Deve mostrar `www-data` como owner. Se não:

```bash
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache
```

### Verificar Arquivo .env

```bash
docker exec -it estoque-backend cat /var/www/.env | grep -E "APP_KEY|DB_"
```

Deve ter:
- `APP_KEY=base64:...` (não vazio)
- `DB_HOST=mysql`
- `DB_DATABASE=estoque`
- `DB_USERNAME=estoque`
- `DB_PASSWORD=estoque`

### Testar Conexão com Banco

```bash
docker exec -it estoque-backend php artisan db:show
```

Deve mostrar informações do MySQL sem erros.

### Limpar Cache Completamente

```bash
docker exec -it estoque-backend bash -c "
php artisan cache:clear && \
php artisan config:clear && \
php artisan route:clear && \
php artisan view:clear
"
```

---

## ✅ Checklist de Verificação

- [ ] Container `estoque-backend` está "Up"
- [ ] Container `estoque-nginx` está "Up"
- [ ] Logs do backend mostram `✅ Aplicação pronta!`
- [ ] Logs do backend mostram `🚀 Iniciando PHP-FPM...`
- [ ] Comando `ps aux | grep php-fpm` mostra processos rodando
- [ ] Arquivo `.env` existe e tem `APP_KEY` preenchida
- [ ] Conexão com banco funciona (`php artisan db:show`)
- [ ] Permissões de `storage/` e `bootstrap/cache/` estão corretas

---

## 📞 Ainda com Problemas?

### Teste Manual da API

```bash
# Testar health check
curl http://localhost:8000/

# Testar API
curl http://localhost:8000/api/dashboard

# Ver headers da resposta
curl -I http://localhost:8000/api/dashboard
```

### Verificar Porta 9000

```bash
# Ver se PHP-FPM está escutando na porta 9000
docker exec -it estoque-backend netstat -tuln | grep 9000
```

Deve mostrar:
```
tcp   0   0 0.0.0.0:9000   0.0.0.0:*   LISTEN
```

### Logs Detalhados do Laravel

```bash
docker exec -it estoque-backend tail -100 /var/www/storage/logs/laravel.log
```

---

## 🎯 Solução de Última Instância

Se nada funcionar, recrie tudo do zero:

```bash
# Parar e remover tudo
docker-compose down -v

# Remover volumes órfãos
docker volume prune -f

# Reconstruir sem cache
docker-compose build --no-cache

# Subir novamente
docker-compose up -d

# Aguardar 2 minutos para tudo inicializar
sleep 120

# Testar
curl http://localhost:8000/api/dashboard
```

---

## 📝 Informações Úteis

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3001
- **PHPMyAdmin**: http://localhost:8080
- **Swagger**: http://localhost:8000/api/documentation

### Acessar Containers

```bash
# Backend
docker exec -it estoque-backend bash

# MySQL
docker exec -it estoque-mysql mysql -u estoque -pestoque estoque

# Nginx
docker exec -it estoque-nginx sh
```
