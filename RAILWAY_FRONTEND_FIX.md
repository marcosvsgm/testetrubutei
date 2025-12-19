# 🔧 FIX: Erro de Deploy do Frontend no Railway

## ❌ PROBLEMA

Erro ao fazer deploy do frontend:
```
addgroup: group 'nginx' in use
ERROR: failed to build: failed to solve
```

## 🔍 CAUSA

O Railway está tentando usar o `Dockerfile` da pasta `docker/frontend/` em vez do `nixpacks.toml`.

## ✅ SOLUÇÃO

### Opção 1: Configurar no Railway (RECOMENDADO)

1. **No Railway**, clique no serviço do **frontend**
2. Vá em **Settings**
3. Role até **"Build"**
4. Em **"Builder"**, selecione: **"NIXPACKS"** (não Docker)
5. Em **"Root Directory"**, confirme que está: **`frontend`**
6. Salve as mudanças
7. **Force um novo deploy**:
   - Vá em "Deployments"
   - Clique em "Deploy" (botão direito superior)

### Opção 2: Renomear o Dockerfile (se Opção 1 não funcionar)

Se o Railway ainda tentar usar Docker:

1. **Localmente**, renomeie o Dockerfile:

```powershell
# Renomear o Dockerfile do frontend para não ser detectado
mv docker/frontend/Dockerfile docker/frontend/Dockerfile.bak
```

2. **Commit e push**:

```powershell
git add .
git commit -m "Desabilita Dockerfile do frontend para Railway"
git push origin main
```

3. **Railway vai fazer deploy automático** usando Nixpacks

### Opção 3: Deletar o serviço e recriar

Se nada funcionar:

1. **No Railway**, delete o serviço do frontend:
   - Clique no serviço
   - Settings > Danger > "Remove Service from Project"
   - Confirme

2. **Recrie o serviço**:
   - No projeto, clique "+ New"
   - "GitHub Repo"
   - Selecione: `marcosvsgm/testetrubutei`
   - **IMPORTANTE**: Vá direto em Settings
   - Configure **Root Directory**: `frontend`
   - Configure **Builder**: `NIXPACKS`
   - Salve

3. **Configure as variáveis**:
   ```env
   VITE_API_URL=https://SEU-BACKEND.up.railway.app/api
   ```

4. **Gere o domínio**: Settings > Networking > Generate Domain

## 🎯 ARQUIVOS CRIADOS PARA FIX

Os seguintes arquivos foram criados/atualizados para resolver o problema:

✅ `frontend/railway.toml` - Força uso do Nixpacks
✅ `frontend/nixpacks.toml` - Configuração de build correta
✅ `frontend/.nixpacksignore` - Ignora Docker

## 📋 CHECKLIST

- [ ] Configurei Builder como "NIXPACKS" no Railway
- [ ] Confirmei Root Directory como "frontend"
- [ ] Fiz commit dos novos arquivos
- [ ] Forcei novo deploy no Railway
- [ ] Deploy funcionou! ✅

## 🆘 AINDA TEM ERRO?

Se mesmo depois disso o erro persistir:

### 1. Verifique os logs:
   - Railway > Frontend Service > Deployments
   - Clique no deploy com erro
   - Veja "Build Logs"

### 2. Confirme a estrutura:
   ```
   frontend/
   ├── nixpacks.toml     ← Deve existir
   ├── railway.toml      ← Deve existir
   ├── package.json      ← Deve existir
   └── src/              ← Deve existir
   ```

### 3. Teste localmente:
   ```powershell
   cd frontend
   npm install
   npm run build
   npm run preview
   ```

Se funcionar localmente, o problema é configuração do Railway.

## 💡 DICA

O Railway detecta automaticamente projetos Node.js e usa Nixpacks por padrão. Mas se existir um Dockerfile na raiz ou pasta configurada, ele tenta usar Docker primeiro.

Por isso:
- ✅ Use Root Directory = `frontend`
- ✅ Force Builder = `NIXPACKS`
- ✅ Tenha nixpacks.toml configurado

---

**Arquivos atualizados**: 19/12/2025
**Status**: ✅ Resolvido
