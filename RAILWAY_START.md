# 🎯 RESUMO: Deploy no Railway em 10 Passos

## 🚀 O QUE VOCÊ PRECISA FAZER AGORA:

### 1. COMMIT E PUSH DOS ARQUIVOS
```powershell
git add .
git commit -m "Adiciona configurações para Railway"
git push origin main
```

---

## 📋 ORDEM DE EXECUÇÃO NO RAILWAY:

```
┌─────────────────────────────────────────────────────────────┐
│  1. CRIAR CONTA NO RAILWAY (railway.app)                   │
│     ↓                                                       │
│  2. LOGIN COM GITHUB                                        │
│     ↓                                                       │
│  3. NEW PROJECT > Deploy from GitHub                       │
│     ↓                                                       │
│  4. SELECIONAR: marcosvsgm/testetrubutei                   │
│     ↓                                                       │
│  5. ADICIONAR MySQL (+ New > Database > MySQL)             │
│     ↓                                                       │
│  6. CONFIGURAR BACKEND:                                     │
│     • Variables > RAW Editor                                │
│     • Colar variáveis de ambiente                          │
│     • Gerar APP_KEY: php artisan key:generate --show      │
│     ↓                                                       │
│  7. GERAR DOMÍNIO DO BACKEND:                              │
│     • Settings > Networking > Generate Domain              │
│     • COPIAR O DOMÍNIO!                                    │
│     ↓                                                       │
│  8. CRIAR SERVIÇO DO FRONTEND:                             │
│     • + New > GitHub Repo                                  │
│     • Settings > Root Directory: "frontend"                │
│     ↓                                                       │
│  9. CONFIGURAR FRONTEND:                                    │
│     • Variables > VITE_API_URL                             │
│     • Usar domínio do backend                              │
│     ↓                                                       │
│  10. GERAR DOMÍNIO DO FRONTEND:                            │
│      • Settings > Networking > Generate Domain             │
│      • ESTE É O ENDEREÇO FINAL!                           │
│      ↓                                                      │
│  11. ATUALIZAR CORS NO CÓDIGO:                             │
│      • Editar config/cors.php                              │
│      • Commit e push                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 ARQUIVOS CRIADOS:

✅ `railway.json` - Configuração do projeto
✅ `nixpacks.toml` - Build do backend
✅ `backend/api/.env.railway` - Template de variáveis
✅ `backend/api/Procfile` - Comando de inicialização
✅ `frontend/nixpacks.toml` - Build do frontend
✅ `RAILWAY_DEPLOY_GUIDE.md` - Guia completo detalhado
✅ `RAILWAY_CHECKLIST.md` - Checklist rápido

---

## 🔑 VARIÁVEIS IMPORTANTES:

### Backend (copie e cole no Railway):
```env
APP_NAME=Sistema de Estoque
APP_ENV=production
APP_DEBUG=false
APP_KEY=                    # ⚠️ VOCÊ PRECISA GERAR!
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

### Frontend (copie e cole no Railway):
```env
VITE_API_URL=https://SEU-DOMINIO-BACKEND.up.railway.app/api
```

---

## ⚠️ ATENÇÃO - PASSOS CRÍTICOS:

1. **APP_KEY**: Execute localmente `php artisan key:generate --show`
2. **DOMÍNIOS**: Copie o domínio do backend para usar no frontend
3. **CORS**: Após tudo funcionando, atualize o CORS localmente e faça push

---

## ⏱️ TEMPO ESTIMADO:

- Primeira vez: **25-30 minutos**
- Próximos deploys: **Automático (push no GitHub)**

---

## 🆘 SE DER ERRO:

### Erro 502 no Backend:
1. Backend > Settings > Deploy
2. Custom Start Command:
   ```bash
   php artisan migrate --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
   ```

### Frontend não conecta:
1. Verifique VITE_API_URL
2. Verifique CORS no backend
3. Confirme domínio público do backend

---

## 💰 CUSTOS:

- **GRATUITO**: $5 de crédito por mês
- **Suficiente para**: Testes e projetos pequenos
- **Não precisa**: Cartão de crédito

---

## 📞 SUPORTE:

- Documentação: https://docs.railway.app
- Discord: https://railway.app/discord
- Status: https://status.railway.app

---

## ✅ PRÓXIMOS PASSOS APÓS DEPLOY:

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar domínio customizado (opcional)
3. ✅ Configurar backup do banco
4. ✅ Monitorar uso de recursos
5. ✅ Configurar variáveis de email (se necessário)

---

**🚀 Boa sorte com seu deploy!**

---

Para mais detalhes, consulte:
- `RAILWAY_DEPLOY_GUIDE.md` - Guia completo passo a passo
- `RAILWAY_CHECKLIST.md` - Checklist rápido e objetivo
