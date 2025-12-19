# 🚂 Guia Completo de Deploy no Railway

## 📋 Pré-requisitos

Antes de começar, você precisa:
- ✅ Conta no GitHub (gratuita)
- ✅ Conta no Railway (gratuita - https://railway.app)
- ✅ Código no GitHub
- ✅ Git instalado no seu computador

---

## 🎯 PASSO 1: Criar Conta no Railway

1. **Acesse**: https://railway.app
2. **Clique em**: "Login" (canto superior direito)
3. **Escolha**: "Login with GitHub"
4. **Autorize**: O Railway acessar sua conta GitHub
5. **Pronto**: Você será redirecionado para o dashboard do Railway

---

## 🎯 PASSO 2: Preparar o Código (Já está pronto!)

Os arquivos necessários já foram criados:
- ✅ `railway.json` - Configuração do Railway
- ✅ `backend/api/.env.railway` - Variáveis de ambiente
- ✅ `backend/api/Procfile` - Comando de inicialização
- ✅ `nixpacks.toml` - Configuração de build

**Você só precisa fazer commit e push:**

```powershell
git add .
git commit -m "Adiciona configurações para Railway"
git push origin main
```

---

## 🎯 PASSO 3: Criar Projeto no Railway

1. **No Dashboard do Railway**, clique em: **"New Project"**
2. **Escolha**: **"Deploy from GitHub repo"**
3. **Configure GitHub** (se for a primeira vez):
   - Clique em "Configure GitHub App"
   - Selecione seu repositório `testetrubutei`
   - Autorize o acesso
4. **Selecione**: Seu repositório `marcosvsgm/testetrubutei`
5. **Aguarde**: O Railway vai detectar automaticamente que é um projeto Laravel

---

## 🎯 PASSO 4: Adicionar Banco de Dados MySQL

1. **No seu projeto Railway**, clique em: **"+ New"**
2. **Selecione**: **"Database"**
3. **Escolha**: **"Add MySQL"**
4. **Aguarde**: O MySQL será provisionado (leva ~30 segundos)

---

## 🎯 PASSO 5: Configurar Variáveis de Ambiente do Backend

1. **Clique no serviço** do seu backend (Laravel)
2. **Vá em**: **"Variables"** (aba lateral)
3. **Clique em**: **"RAW Editor"**
4. **Cole as seguintes variáveis**:

```env
APP_NAME=Sistema de Estoque
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:XXXXX
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Database (Railway vai preencher automaticamente)
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

5. **Clique em**: **"Save Changes"**

---

## 🎯 PASSO 6: Gerar APP_KEY do Laravel

**IMPORTANTE**: Você precisa gerar uma chave única para o Laravel.

1. **No terminal do Railway** (ou localmente):
   ```bash
   php artisan key:generate --show
   ```
   
2. **Copie** a chave gerada (exemplo: `base64:xxxxxxxxxxxxxxxxxxxxx`)

3. **Volte nas variáveis** do Railway

4. **Substitua** o valor de `APP_KEY` pela chave gerada

5. **Salve** novamente

---

## 🎯 PASSO 7: Configurar Domínio Público (Backend)

1. **No serviço do backend**, clique em: **"Settings"**
2. **Role até**: **"Networking"**
3. **Em "Public Networking"**, clique em: **"Generate Domain"**
4. **Copie o domínio** gerado (exemplo: `seu-app.up.railway.app`)
5. **Guarde esse domínio** - você vai precisar dele!

---

## 🎯 PASSO 8: Executar Migrations (Primeira vez)

Após o deploy do backend:

1. **Clique no serviço** do backend
2. **Vá em**: **"Deployments"**
3. **Aguarde** o deploy terminar (status: "Success")
4. **Clique nos 3 pontinhos** ao lado do deploy
5. **Selecione**: **"View Logs"**
6. **Verifique** se as migrations rodaram automaticamente

Se NÃO rodaram automaticamente:

1. **Vá em**: **"Settings" > "Deploy"**
2. **Em "Custom Start Command"**, adicione:
   ```bash
   php artisan migrate --force && php artisan config:cache && php-fpm
   ```

---

## 🎯 PASSO 9: Criar Serviço para o Frontend

1. **No seu projeto Railway**, clique em: **"+ New"**
2. **Escolha**: **"GitHub Repo"**
3. **Selecione**: O mesmo repositório `testetrubutei`
4. **Configure o Root Directory**:
   - Vá em **"Settings"**
   - Em **"Root Directory"**, digite: `frontend`
   - Salve

---

## 🎯 PASSO 10: Configurar Variáveis de Ambiente do Frontend

1. **No serviço do frontend**, vá em: **"Variables"**
2. **Adicione**:

```env
VITE_API_URL=https://SEU-BACKEND-DOMAIN.up.railway.app/api
```

**IMPORTANTE**: Substitua `SEU-BACKEND-DOMAIN` pelo domínio que você copiou no PASSO 7!

3. **Salve**

---

## 🎯 PASSO 11: Configurar Domínio Público (Frontend)

1. **No serviço do frontend**, clique em: **"Settings"**
2. **Role até**: **"Networking"**
3. **Em "Public Networking"**, clique em: **"Generate Domain"**
4. **Copie o domínio** do frontend
5. **Pronto!** Este é o endereço para acessar sua aplicação!

---

## 🎯 PASSO 12: Atualizar CORS no Backend

Você precisa permitir que o frontend acesse o backend:

1. **Localmente**, edite: `backend/api/config/cors.php`

2. **Encontre** `allowed_origins` e adicione o domínio do frontend:

```php
'allowed_origins' => ['https://seu-frontend.up.railway.app'],
```

3. **Commit e push**:

```powershell
git add .
git commit -m "Atualiza CORS para Railway"
git push origin main
```

4. **O Railway vai fazer deploy automaticamente!**

---

## ✅ PASSO 13: Testar a Aplicação

1. **Acesse** o domínio do frontend: `https://seu-frontend.up.railway.app`
2. **Teste** todas as funcionalidades
3. **Verifique** se a API está respondendo

---

## 🔧 Comandos Úteis

### Ver Logs em Tempo Real

1. Clique no serviço
2. Vá em "Deployments"
3. Clique no deploy ativo
4. Veja os logs

### Forçar Novo Deploy

1. Clique no serviço
2. Vá em "Deployments"
3. Clique em "Deploy" (botão superior direito)

### Executar Comandos

1. Clique no serviço
2. Não tem terminal interativo no plano gratuito
3. Use "Custom Start Command" em Settings

---

## 💰 Custos

- **Plano Hobby (Gratuito)**:
  - $5 de crédito/mês gratuito
  - Suficiente para 1-2 projetos pequenos
  - Sem cartão de crédito necessário

- **Plano Developer ($5/mês)**:
  - $5 de crédito + mais uso
  - Melhor para produção

---

## 🆘 Troubleshooting

### Erro 502 Bad Gateway

**Causa**: Backend não está iniciando corretamente

**Solução**:
1. Verifique os logs do backend
2. Confirme que APP_KEY está configurado
3. Verifique se o MySQL está conectado

### Frontend não conecta no Backend

**Causa**: CORS ou URL incorreta

**Solução**:
1. Verifique VITE_API_URL no frontend
2. Verifique CORS no backend
3. Confirme que o backend tem domínio público

### Migrations não rodaram

**Solução**:
1. Vá em Settings > Deploy
2. Custom Start Command:
   ```bash
   php artisan migrate --force && php artisan config:cache && php-fpm
   ```

### Aplicação lenta

**Causa**: Plano gratuito tem limitações

**Solução**:
1. Otimize queries do banco
2. Use cache quando possível
3. Considere upgrade de plano

---

## 📚 Recursos Adicionais

- **Documentação Railway**: https://docs.railway.app
- **Suporte Railway**: https://railway.app/discord
- **Status Railway**: https://status.railway.app

---

## 🎉 Parabéns!

Seu sistema de estoque está no ar! 🚀

**Próximos passos**:
- Configure domínio customizado (opcional)
- Configure backup do banco de dados
- Monitore o uso de recursos
- Configure variáveis de email (se usar)

---

**Criado em**: 19/12/2025
**Autor**: GitHub Copilot
**Versão**: 1.0
