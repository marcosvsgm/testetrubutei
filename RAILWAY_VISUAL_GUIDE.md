# 🎯 GUIA VISUAL RÁPIDO - Railway Deploy

## 🚀 COMECE AQUI!

### Passo 1: Fazer Push no GitHub
```powershell
git add .
git commit -m "Adiciona configurações para Railway"
git push origin main
```

---

## 🌐 NO NAVEGADOR - Railway.app

### Passo 2: Criar Conta
```
1. Vá para: railway.app
2. Clique: "Login"
3. Escolha: "Login with GitHub"
4. Autorize o Railway
```

### Passo 3: Novo Projeto
```
Dashboard Railway
    ↓
[+ New Project]
    ↓
[Deploy from GitHub repo]
    ↓
Selecionar: marcosvsgm/testetrubutei
    ↓
✅ Projeto criado!
```

### Passo 4: Adicionar MySQL
```
No seu projeto
    ↓
[+ New]
    ↓
[Database]
    ↓
[Add MySQL]
    ↓
⏱️ Aguardar ~30 segundos
    ↓
✅ MySQL pronto!
```

### Passo 5: Configurar Backend
```
Clicar no serviço "testetrubutei"
    ↓
[Variables] (menu lateral)
    ↓
[RAW Editor]
    ↓
Colar as variáveis (veja abaixo)
    ↓
[Add] para cada variável
    ↓
✅ Variáveis salvas!
```

**📋 VARIÁVEIS DO BACKEND (copie tudo):**
```
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

### Passo 6: Gerar APP_KEY
```
⚠️ NO SEU COMPUTADOR, execute:

powershell
    ↓
php artisan key:generate --show
    ↓
Copiar a chave gerada (exemplo: base64:xxxxx...)
    ↓
Voltar no Railway > Variables
    ↓
Editar APP_KEY
    ↓
Colar a chave
    ↓
Salvar
    ↓
✅ APP_KEY configurado!
```

### Passo 7: Gerar Domínio do Backend
```
No serviço do backend
    ↓
[Settings] (menu lateral)
    ↓
Rolar até "Networking"
    ↓
[Generate Domain]
    ↓
📋 COPIAR O DOMÍNIO!
    ↓
Exemplo: seu-app-123.up.railway.app
    ↓
✅ Guardar esse domínio!
```

### Passo 8: Criar Serviço Frontend
```
No projeto (voltar)
    ↓
[+ New]
    ↓
[GitHub Repo]
    ↓
Selecionar: marcosvsgm/testetrubutei
    ↓
Vai criar outro serviço
    ↓
[Settings] do novo serviço
    ↓
Root Directory: frontend
    ↓
[Save]
    ↓
✅ Frontend criado!
```

### Passo 9: Configurar Frontend
```
No serviço do frontend
    ↓
[Variables]
    ↓
Adicionar variável:
    ↓
Nome: VITE_API_URL
Valor: https://SEU-DOMINIO-BACKEND.up.railway.app/api
    ↓
⚠️ Usar o domínio que você copiou no Passo 7!
    ↓
[Add]
    ↓
✅ Frontend configurado!
```

### Passo 10: Gerar Domínio do Frontend
```
No serviço do frontend
    ↓
[Settings]
    ↓
Networking
    ↓
[Generate Domain]
    ↓
🎉 ESTE É O ENDEREÇO FINAL!
    ↓
Exemplo: seu-frontend-456.up.railway.app
    ↓
✅ Copiar e acessar!
```

### Passo 11: Aguardar Deploys
```
Ambos os serviços vão fazer deploy
    ↓
⏱️ Aguardar 3-5 minutos
    ↓
Ver progresso em [Deployments]
    ↓
Aguardar status: "Success" ✅
    ↓
🎉 Deploy completo!
```

### Passo 12: Atualizar CORS (IMPORTANTE!)
```
No seu computador
    ↓
Abrir: backend/api/config/cors.php
    ↓
Procurar: 'allowed_origins'
    ↓
Alterar para:
'allowed_origins' => ['https://seu-frontend.up.railway.app'],
    ↓
Salvar
    ↓
git add .
git commit -m "Configura CORS para Railway"
git push origin main
    ↓
⏱️ Railway vai fazer deploy automático
    ↓
✅ CORS atualizado!
```

### Passo 13: Testar!
```
Abrir o domínio do frontend
    ↓
Testar funcionalidades
    ↓
Verificar se API funciona
    ↓
🎉 SUCESSO!
```

---

## 📊 ESTRUTURA FINAL

```
Railway Project
│
├── 🗄️ MySQL Database
│   └── Dados do sistema
│
├── 🔧 Backend (Laravel/PHP)
│   ├── Domínio: backend-xxx.up.railway.app
│   ├── API: /api/...
│   └── Conectado ao MySQL
│
└── 🎨 Frontend (React/Vite)
    ├── Domínio: frontend-yyy.up.railway.app
    └── Conectado ao Backend
```

---

## ⚠️ PONTOS DE ATENÇÃO

| Item | Ação | Status |
|------|------|--------|
| APP_KEY | Gerar com `php artisan key:generate --show` | ⚠️ |
| Domínio Backend | Copiar para usar no frontend | ⚠️ |
| VITE_API_URL | Configurar com domínio do backend | ⚠️ |
| CORS | Atualizar com domínio do frontend | ⚠️ |
| MySQL | Conectado automaticamente | ✅ |

---

## 🆘 PROBLEMAS?

### ❌ Backend não inicia (502)
```
Backend > Settings > Deploy
Custom Start Command:
php artisan migrate --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=${PORT}
```

### ❌ Frontend não conecta no backend
```
1. Verificar VITE_API_URL no frontend
2. Verificar CORS no backend
3. Confirmar que backend tem domínio público
```

### ❌ Erro de autenticação do banco
```
Verificar se as variáveis ${{MySQL.xxx}} estão corretas
Railway preenche automaticamente
```

---

## 📱 MONITORAMENTO

Após deploy, monitore:

1. **Logs**: Deployments > View Logs
2. **Uso**: Dashboard > Usage
3. **Status**: Ver se serviços estão "Active"
4. **Créditos**: Monitorar os $5 gratuitos

---

## ✅ CHECKLIST FINAL

- [ ] Código no GitHub
- [ ] Conta Railway criada
- [ ] Projeto criado
- [ ] MySQL adicionado
- [ ] Backend configurado
- [ ] APP_KEY gerado
- [ ] Domínio backend gerado
- [ ] Frontend configurado
- [ ] VITE_API_URL configurado
- [ ] Domínio frontend gerado
- [ ] CORS atualizado
- [ ] Tudo testado

---

## 🎉 PARABÉNS!

Seu sistema está no ar! 🚀

**Acesse**: https://seu-frontend.up.railway.app

---

**💡 Dica**: Salve os domínios em algum lugar para não esquecer!

**📚 Mais detalhes**: Veja `RAILWAY_DEPLOY_GUIDE.md`
