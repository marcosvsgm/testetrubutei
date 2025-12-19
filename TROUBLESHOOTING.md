# 🔧 Guia de Troubleshooting - Sistema de Estoque

## 🚫 Erro 502 Bad Gateway

### Sintomas
```
Status Code: 502 Bad Gateway
Request URL: http://localhost:8000/api/documentation
Request URL: http://localhost:8000/api/dashboard
```

### Causas Comuns
1. ⚠️ PHP-FPM não está rodando ou travou
2. ⚠️ Backend está inicializando (aguarde 1-2 minutos)
3. ⚠️ Erro fatal no PHP que impediu o PHP-FPM de iniciar
4. ⚠️ Permissões incorretas nos diretórios

### Solução Rápida
```bash
# 1. Verificar se o backend está realmente rodando
docker ps

# 2. Ver os logs do backend
docker logs estoque-backend --tail 100

# 3. Ver os logs do nginx
docker logs estoque-nginx --tail 50

# 4. Se o backend estiver travado, reinicie apenas ele
docker-compose restart backend nginx

# 5. Aguarde 30-60 segundos e teste novamente
curl http://localhost:8000/api/dashboard
```

### Se ainda não funcionar, reconstrua os containers:
```bash
# Parar tudo
docker-compose down

# Reconstruir e subir
docker-compose up -d --build

# Monitorar os logs
docker-compose logs -f backend
```

---

## ❌ Erro CORS + 500 Internal Server Error

### Sintomas
```
Access to XMLHttpRequest at 'http://localhost:8000/api/produtos' from origin 'http://localhost:3001' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

GET http://localhost:8000/api/produtos net::ERR_FAILED 500 (Internal Server Error)
```

### Causas Comuns
1. ✅ CORS não configurado (JÁ CORRIGIDO)
2. ⚠️ Migrations não executadas (banco de dados não criado)
3. ⚠️ Tabelas não existem
4. ⚠️ APP_KEY não gerada
5. ⚠️ Conexão com banco de dados falhou

---

## 🚀 Solução Passo a Passo

### 1️⃣ Verificar se os containers estão rodando
```bash
docker-compose ps
```

Todos devem estar "Up". Se algum estiver "Exit", reinicie:
```bash
docker-compose restart
```

### 2️⃣ Gerar APP_KEY (se ainda não foi feito)
```bash
docker-compose exec backend php artisan key:generate
```

### 3️⃣ Verificar conexão com banco de dados
```bash
# Testar conexão
docker-compose exec backend php artisan db:show

# Ou verificar se o MySQL está acessível
docker-compose exec mysql mysql -u estoque -pestoque -e "SHOW DATABASES;"
```

### 4️⃣ Executar Migrations (IMPORTANTE!)
```bash
# Ver status das migrations
docker-compose exec backend php artisan migrate:status

# Executar migrations
docker-compose exec backend php artisan migrate

# OU limpar tudo e começar do zero
docker-compose exec backend php artisan migrate:fresh
```

### 5️⃣ Popular o banco de dados
```bash
docker-compose exec backend php artisan db:seed
```

### 6️⃣ Limpar cache do Laravel
```bash
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
```

### 7️⃣ Verificar rotas da API
```bash
docker-compose exec backend php artisan route:list --path=api
```

Deve mostrar:
- GET|HEAD api/categorias
- POST api/categorias
- GET|HEAD api/produtos
- POST api/produtos
- GET|HEAD api/vendas
- POST api/vendas
- GET|HEAD api/dashboard

### 8️⃣ Verificar logs de erro
```bash
# Ver últimas 50 linhas do log
docker-compose exec backend tail -50 /var/www/storage/logs/laravel.log

# OU monitorar em tempo real
docker-compose exec backend tail -f /var/www/storage/logs/laravel.log
```

### 9️⃣ Testar API diretamente
```bash
# Testar endpoint de produtos
curl http://localhost:8000/api/produtos

# Testar endpoint de categorias
curl http://localhost:8000/api/categorias

# Testar endpoint de dashboard
curl http://localhost:8000/api/dashboard
```

Se retornar JSON, a API está funcionando!

### 🔟 Reiniciar containers (última opção)
```bash
docker-compose down
docker-compose up -d
```

---

## 🔍 Comandos de Diagnóstico

### Verificar variáveis de ambiente
```bash
docker-compose exec backend php artisan env
```

### Verificar se as tabelas existem
```bash
docker-compose exec mysql mysql -u estoque -pestoque estoque -e "SHOW TABLES;"
```

Deve mostrar:
- cache
- cache_locks
- categorias
- failed_jobs
- job_batches
- jobs
- migrations
- password_reset_tokens
- produtos
- sessions
- users
- vendas

### Contar registros nas tabelas
```bash
docker-compose exec mysql mysql -u estoque -pestoque estoque -e "
  SELECT 'categorias' as tabela, COUNT(*) as total FROM categorias
  UNION ALL
  SELECT 'produtos', COUNT(*) FROM produtos
  UNION ALL
  SELECT 'vendas', COUNT(*) FROM vendas;
"
```

### Verificar configuração do banco
```bash
docker-compose exec backend php artisan tinker

# Dentro do tinker, digite:
DB::connection()->getPdo();
# Se retornar um objeto PDO, a conexão está OK

DB::table('produtos')->count();
# Deve retornar o número de produtos
```

---

## 🐛 Erros Específicos e Soluções

### Erro: "SQLSTATE[HY000] [2002] Connection refused"
**Causa**: Backend não consegue conectar ao MySQL

**Solução**:
```bash
# Verificar se MySQL está rodando
docker-compose ps mysql

# Reiniciar MySQL
docker-compose restart mysql

# Aguardar 10 segundos e testar novamente
docker-compose exec backend php artisan migrate
```

### Erro: "SQLSTATE[42S02]: Base table or view not found"
**Causa**: Tabelas não foram criadas

**Solução**:
```bash
docker-compose exec backend php artisan migrate
```

### Erro: "No application encryption key has been specified"
**Causa**: APP_KEY não foi gerada

**Solução**:
```bash
docker-compose exec backend php artisan key:generate
```

### Erro: "Class 'App\Models\Venda' not found"
**Causa**: Autoload do Composer não está atualizado

**Solução**:
```bash
docker-compose exec backend composer dump-autoload
```

### CORS ainda bloqueado após correções
**Solução**:
```bash
# 1. Limpar cache
docker-compose exec backend php artisan config:clear

# 2. Reiniciar o container
docker-compose restart backend

# 3. Hard refresh no navegador (Ctrl+Shift+R ou Cmd+Shift+R)
```

---

## ✅ Checklist Completo de Setup

Execute na ordem:

```bash
# 1. Subir containers
docker-compose up -d

# 2. Aguardar MySQL iniciar (importante!)
sleep 10

# 3. Gerar APP_KEY
docker-compose exec backend php artisan key:generate

# 4. Executar migrations
docker-compose exec backend php artisan migrate

# 5. Popular banco de dados
docker-compose exec backend php artisan db:seed

# 6. Limpar caches
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# 7. Verificar rotas
docker-compose exec backend php artisan route:list --path=api

# 8. Testar API
curl http://localhost:8000/api/produtos
```

---

## 🌐 Testar no Browser

### Backend (Laravel)
- API Health: http://localhost:8000/up
- Produtos: http://localhost:8000/api/produtos
- Categorias: http://localhost:8000/api/categorias
- Dashboard: http://localhost:8000/api/dashboard

### Frontend (React)
- Interface: http://localhost:3001

### phpMyAdmin
- URL: http://localhost:8080
- Servidor: mysql
- Usuário: root
- Senha: root

---

## 📝 Script de Setup Completo

Salve este script como `setup.sh` ou `setup.ps1`:

### Linux/Mac (setup.sh)
```bash
#!/bin/bash
echo "🚀 Iniciando setup do Sistema de Estoque..."

echo "📦 Subindo containers..."
docker-compose up -d

echo "⏳ Aguardando MySQL iniciar..."
sleep 15

echo "🔑 Gerando APP_KEY..."
docker-compose exec backend php artisan key:generate

echo "🗄️ Executando migrations..."
docker-compose exec backend php artisan migrate

echo "🌱 Populando banco de dados..."
docker-compose exec backend php artisan db:seed

echo "🧹 Limpando caches..."
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

echo "✅ Setup concluído!"
echo "📊 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:3001"
echo "🗃️ phpMyAdmin: http://localhost:8080"
```

### Windows PowerShell (setup.ps1)
```powershell
Write-Host "🚀 Iniciando setup do Sistema de Estoque..." -ForegroundColor Green

Write-Host "📦 Subindo containers..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "⏳ Aguardando MySQL iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "🔑 Gerando APP_KEY..." -ForegroundColor Cyan
docker-compose exec backend php artisan key:generate

Write-Host "🗄️ Executando migrations..." -ForegroundColor Cyan
docker-compose exec backend php artisan migrate

Write-Host "🌱 Populando banco de dados..." -ForegroundColor Cyan
docker-compose exec backend php artisan db:seed

Write-Host "🧹 Limpando caches..." -ForegroundColor Cyan
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host "📊 Backend: http://localhost:8000" -ForegroundColor White
Write-Host "🎨 Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "🗃️ phpMyAdmin: http://localhost:8080" -ForegroundColor White
```

---

## 📞 Suporte

Se o problema persistir após seguir todos os passos:

1. Verifique os logs: `docker-compose logs backend`
2. Verifique o arquivo `.env` está correto
3. Certifique-se que as portas 3001, 8000, 8080 e 3306 não estão em uso
4. Reinicie o Docker completamente
