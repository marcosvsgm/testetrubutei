# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar apenas arquivos de dependências para melhor cache
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci --prefer-offline --no-audit

# ================================
# Stage 2: Development
# ================================
FROM node:20-alpine AS development

# Metadados da imagem
LABEL maintainer="Sistema de Estoque"
LABEL description="Frontend React + Vite - Ambiente de Desenvolvimento"
LABEL version="1.0"

WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 && \
    chown -R reactuser:nodejs /app

USER reactuser

# Health check para monitoramento
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Expor porta do Vite
EXPOSE 3000

# Comando para desenvolvimento (com hot-reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ================================
# Stage 3: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ================================
# Stage 4: Production
# ================================
FROM nginx:alpine AS production

# Metadados da imagem
LABEL maintainer="Sistema de Estoque"
LABEL description="Frontend React + Vite - Ambiente de Produção"
LABEL version="1.0"

# Criar configuração do Nginx
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    \
    location /api { \
        proxy_pass http://backend:8000; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto \$scheme; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Criar usuário não-root
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expor porta
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
