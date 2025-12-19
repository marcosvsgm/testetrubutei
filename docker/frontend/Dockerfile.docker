# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar arquivos de dependências
COPY frontend/package.json frontend/package-lock.json* ./

# Instalar dependências
RUN npm ci --prefer-offline --no-audit

# ================================
# Stage 2: Development
# ================================
FROM node:20-alpine AS development

# Metadados da imagem
LABEL maintainer="Sistema de Estoque"
LABEL description="Frontend React com Vite"

WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY frontend/ ./

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 && \
    chown -R reactuser:nodejs /app

USER reactuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento (com hot-reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ================================
# Stage 3: Builder (para produção)
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY frontend/ ./

# Build da aplicação
RUN npm run build

# ================================
# Stage 4: Production
# ================================
FROM nginx:alpine AS production

# Copiar build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx (opcional)
# COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
