# ================================
# Stage 1: Composer Dependencies
# ================================
FROM composer:2.7 AS composer-builder

WORKDIR /app

# Copiar apenas arquivos necessários para o composer
COPY backend/api/composer.json backend/api/composer.lock* ./

# Instalar dependências do composer (apenas produção por padrão)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --optimize-autoloader

# Copiar todo o código fonte
COPY backend/api ./

# Gerar autoloader otimizado
RUN composer dump-autoload --optimize --classmap-authoritative

# ================================
# Stage 2: Production Image
# ================================
FROM php:8.2-fpm-alpine

# Metadados da imagem
LABEL maintainer="Sistema de Estoque"
LABEL description="Backend Laravel com PHP-FPM"

# Argumentos de build
ARG BUILD_DATE
ARG VCS_REF
ENV COMPOSER_ALLOW_SUPERUSER=1

# Instalar dependências do sistema
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    bash \
    mysql-client \
    && rm -rf /var/cache/apk/*

# Configurar extensões GD com suporte a JPEG e FreeType
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg

# Instalar extensões PHP
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Configurar PHP para produção
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=256'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=20000'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.save_comments=1'; \
    echo 'opcache.fast_shutdown=1'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# Configurações PHP customizadas
RUN { \
    echo 'memory_limit=512M'; \
    echo 'upload_max_filesize=50M'; \
    echo 'post_max_size=50M'; \
    echo 'max_execution_time=300'; \
    echo 'max_input_time=300'; \
    echo 'date.timezone=America/Sao_Paulo'; \
    } > /usr/local/etc/php/conf.d/custom.ini

# Copiar Composer do estágio anterior
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Copiar código da aplicação do estágio do composer
COPY --from=composer-builder --chown=www-data:www-data /app /var/www

# Copiar script de inicialização
COPY backend/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Criar estrutura de diretórios necessários
RUN mkdir -p \
    storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/app/public \
    bootstrap/cache \
    public/storage

# Ajustar permissões iniciais
RUN chown -R www-data:www-data \
    /var/www/storage \
    /var/www/bootstrap/cache \
    /var/www/public/storage

RUN chmod -R 775 \
    /var/www/storage \
    /var/www/bootstrap/cache

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD php-fpm -t || exit 1

# Expor porta PHP-FPM
EXPOSE 9000

# Usar entrypoint personalizado (executa como root, depois muda para www-data)
ENTRYPOINT ["docker-entrypoint.sh"]
