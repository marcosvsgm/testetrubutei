# 🚀 CHECKLIST RÁPIDO - Deploy Railway

## ✅ ANTES DE COMEÇAR

- [ ] Conta no GitHub criada
- [ ] Conta no Railway criada (railway.app)
- [ ] Código commitado no GitHub
- [ ] Git configurado localmente

---

## 📝 PASSOS OBRIGATÓRIOS

### 1️⃣ PREPARAR O CÓDIGO (5 minutos)

```powershell
# No seu terminal, execute:
git add .
git commit -m "Adiciona configurações para Railway"
git push origin main
```

---

### 2️⃣ CRIAR PROJETO NO RAILWAY (2 minutos)

1. Acesse: **railway.app**
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha: **marcosvsgm/testetrubutei**

---

### 3️⃣ ADICIONAR MYSQL (1 minuto)

1. No projeto, clique **"+ New"**
2. Escolha **"Database" > "MySQL"**
3. Aguarde provisionamento

---

### 4️⃣ CONFIGURAR BACKEND (5 minutos)

1. Clique no serviço do **backend**
2. Vá em **"Variables"** > **"RAW Editor"**
3. Cole:

```env
APP_NAME=Sistema de Estoque
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=error
APP_TIMEZONE=America/Sao_Paulo
```

4. **IMPORTANTE**: Gere APP_KEY:
   - Execute localmente: `php artisan key:generate --show`
   - Copie a chave e cole no APP_KEY acima

5. Salve as variáveis

---

### 5️⃣ GERAR DOMÍNIO DO BACKEND (1 minuto)

1. No backend, vá em **"Settings"**
2. Em **"Networking"**, clique **"Generate Domain"**
3. **COPIE O DOMÍNIO** (você vai precisar!)

---

### 6️⃣ CRIAR SERVIÇO DO FRONTEND (3 minutos)

1. No projeto, clique **"+ New"**
2. Escolha **"GitHub Repo"**
3. Selecione o mesmo repositório
4. Vá em **"Settings"**
5. Em **"Root Directory"**, digite: `frontend`
6. Salve

---

### 7️⃣ CONFIGURAR FRONTEND (2 minutos)

1. No serviço do frontend, vá em **"Variables"**
2. Adicione:

```env
VITE_API_URL=https://SEU-DOMINIO-BACKEND.up.railway.app/api
```

**SUBSTITUA** `SEU-DOMINIO-BACKEND` pelo domínio que você copiou!

3. Salve

---

### 8️⃣ GERAR DOMÍNIO DO FRONTEND (1 minuto)

1. No frontend, vá em **"Settings"**
2. Em **"Networking"**, clique **"Generate Domain"**
3. **ESTE É O ENDEREÇO DA SUA APLICAÇÃO!**

---

### 9️⃣ ATUALIZAR CORS (3 minutos)

1. Localmente, edite: `backend/api/config/cors.php`

2. Procure por `'allowed_origins'` e altere para:

```php
'allowed_origins' => ['https://seu-dominio-frontend.up.railway.app'],
```

3. Commit e push:

```powershell
git add .
git commit -m "Configura CORS para Railway"
git push origin main
```

---

### 🔟 TESTAR (2 minutos)

1. Acesse o domínio do frontend
2. Teste as funcionalidades
3. Verifique se conecta na API

---

## ⏱️ TEMPO TOTAL: ~25 minutos

---

## 🆘 PROBLEMAS COMUNS

### ❌ Erro 502 no Backend

**Solução**:
1. Vá em backend > Settings > Deploy
2. Custom Start Command:
```bash
php artisan migrate --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
```

### ❌ Frontend não conecta no Backend

**Solução**:
1. Verifique se VITE_API_URL está correto
2. Verifique se CORS está configurado
3. Confirme que backend tem domínio público

### ❌ Erro de APP_KEY

**Solução**:
1. Execute localmente: `php artisan key:generate --show`
2. Copie a chave
3. Cole em APP_KEY nas variáveis do Railway

---

## 💡 DICAS

- ✅ Primeiro deploy demora ~5 minutos
- ✅ Deploys seguintes são mais rápidos
- ✅ Railway faz deploy automático quando você faz push
- ✅ Você tem $5 gratuitos por mês
- ✅ Monitore o uso no dashboard

---

## 📱 CONTATOS

- **Documentação**: docs.railway.app
- **Discord**: railway.app/discord
- **Status**: status.railway.app

---

**Boa sorte com seu deploy! 🚀**
