# 🚀 Guia Rápido - Docker

## Início Rápido (3 Passos)

### 1️⃣ Configurar Variáveis de Ambiente

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

### 2️⃣ Construir e Iniciar

```bash
# Construir imagens
docker-compose build

# Iniciar containers
docker-compose up -d
```

### 3️⃣ Acessar a Aplicação

- **Backend API:** http://localhost:8000
- **Swagger:** http://localhost:8000/api/documentation  
- **Frontend:** http://localhost:3001
- **PHPMyAdmin:** http://localhost:8080

---

## 📋 Comandos Essenciais

### Com Docker Compose

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose build --no-cache

# Status
docker-compose ps
```

### Com Makefile (Recomendado)

```bash
# Ver todos os comandos
make help

# Desenvolvimento
make dev              # Inicia tudo
make build            # Rebuild
make down             # Para tudo
make logs             # Ver logs
make info             # Ver URLs

# Banco de Dados
make db-reset         # Resetar banco
make db-migrate       # Migrations
make db-seed          # Seeders

# Shell
make shell-backend    # Acessar backend
make shell-mysql      # MySQL CLI

# Laravel
make cache-clear      # Limpar caches
make swagger          # Gerar docs
```

---

## 🔧 Troubleshooting Rápido

### ❌ Porta já em uso

```bash
# Mudar portas no .env
NGINX_PORT=8001
FRONTEND_PORT=3002
MYSQL_PORT=3307
```

### ❌ Permissões negadas

```bash
# Ajustar permissões
docker-compose exec backend chown -R www-data:www-data /var/www/storage
```

### ❌ Container não inicia

```bash
# Ver logs
docker-compose logs backend

# Rebuild limpo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### ❌ MySQL não conecta

```bash
# Aguardar MySQL inicializar (30s)
# Ver logs
docker-compose logs mysql
```

---

## 📁 Estrutura Simplificada

```
estoque/
├── docker-compose.yml     # Configuração principal
├── .env                   # Suas variáveis (criar)
├── backend/
│   ├── Dockerfile         # Backend (PHP-FPM)
│   └── api/              # Código Laravel
├── docker/
│   ├── frontend/
│   │   └── Dockerfile     # Frontend (React)
│   ├── nginx/
│   │   └── default.conf   # Config Nginx
│   └── mysql/
│       └── my.cnf        # Config MySQL
└── frontend/             # Código React
```

---

## ⚡ Scripts Automatizados

### Windows PowerShell

```powershell
# start.ps1
docker-compose up -d
Write-Host "✅ Aplicação iniciada!"
Write-Host "🌐 Backend: http://localhost:8000"
Write-Host "🎨 Frontend: http://localhost:3001"
```

### Linux/Mac

```bash
# start.sh
#!/bin/bash
docker-compose up -d
echo "✅ Aplicação iniciada!"
echo "🌐 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:3001"
```

---

## 🎯 Casos de Uso Comuns

### Desenvolver no Backend

```bash
# 1. Iniciar ambiente
make dev

# 2. Ver logs em tempo real
make logs-backend

# 3. Executar comandos Artisan
make artisan cmd="make:controller UserController"

# 4. Limpar cache
make cache-clear
```

### Desenvolver no Frontend

```bash
# 1. Iniciar ambiente
make dev

# 2. Ver logs
make logs-frontend

# 3. Hot-reload já está ativo!
# Edite arquivos em frontend/src/
```

### Resetar Banco de Dados

```bash
# Opção 1: Makefile
make db-reset

# Opção 2: Docker Compose
docker-compose exec backend php artisan migrate:fresh --seed
```

### Backup do Banco

```bash
# Opção 1: Makefile
make db-backup

# Opção 2: Manual
docker-compose exec mysql mysqldump -uroot -proot estoque > backup.sql
```

---

## 🐛 Debug

### Ver logs detalhados

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

### Entrar no container

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql mysql -uroot -proot estoque
```

### Verificar health checks

```bash
docker ps
# Status deve ser "healthy" para todos
```

---

## 🔄 Workflow Diário

```bash
# Manhã - Iniciar
make dev

# Durante o dia - Ver logs se necessário
make logs

# Final do dia - Parar
make down

# Semanal - Limpeza
make clean
```

---

## 📊 Status e Monitoramento

```bash
# Ver containers rodando
docker ps

# Ver todos os containers
docker ps -a

# Ver uso de recursos
docker stats

# Ver volumes
docker volume ls

# Ver networks
docker network ls
```

---

## 🚨 Em Caso de Problemas

1. **Verificar logs:**
   ```bash
   make logs
   ```

2. **Rebuild limpo:**
   ```bash
   make clean
   make build
   make up
   ```

3. **Verificar .env:**
   - Arquivo existe?
   - Senhas corretas?
   - Portas disponíveis?

4. **Verificar Docker:**
   ```bash
   docker --version
   docker-compose --version
   ```

5. **Reiniciar Docker Desktop** (Windows/Mac)

---

## 📚 Documentação Completa

Veja `DOCKER_GUIDE.md` para documentação detalhada sobre:
- Arquitetura completa
- Explicação de cada Dockerfile
- Otimizações implementadas
- Segurança
- Performance
- E muito mais!

---

## ✅ Checklist de Instalação

- [ ] Docker instalado e rodando
- [ ] Docker Compose instalado
- [ ] Arquivo `.env` criado
- [ ] Portas disponíveis (8000, 3001, 3306, 8080)
- [ ] Build executado: `docker-compose build`
- [ ] Containers iniciados: `docker-compose up -d`
- [ ] Aguardar 30-60s para inicialização
- [ ] Testar URLs:
  - [ ] http://localhost:8000 (API)
  - [ ] http://localhost:8000/api/documentation (Swagger)
  - [ ] http://localhost:3001 (Frontend)
  - [ ] http://localhost:8080 (PHPMyAdmin)

---

**Tudo funcionando? Comece a desenvolver! 🎉**

**Problemas? Consulte `TROUBLESHOOTING.md`**
