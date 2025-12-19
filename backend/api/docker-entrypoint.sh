#!/bin/sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}🚀 Sistema de Estoque - Inicializando Backend${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Função para aguardar o MySQL
wait_for_mysql() {
    echo "${YELLOW}⏳ Aguardando MySQL estar disponível...${NC}"
    
    local max_attempts=30
    local attempt=0
    
    until php -r "new PDO('mysql:host=${DB_HOST};port=${DB_PORT:-3306}', '${DB_USERNAME}', '${DB_PASSWORD}');" >/dev/null 2>&1; do
        attempt=$((attempt + 1))
        
        if [ $attempt -ge $max_attempts ]; then
            echo "${RED}✗ MySQL não ficou disponível após ${max_attempts} tentativas${NC}"
            echo "${YELLOW}⚠️  Continuando mesmo assim...${NC}"
            break
        fi
        
        echo "   Tentativa ${attempt}/${max_attempts} - aguardando 2s..."
        sleep 2
    done
    
    if [ $attempt -lt $max_attempts ]; then
        echo "${GREEN}✓ MySQL está pronto!${NC}"
    fi
    echo ""
}

# Verificar e criar arquivo .env
setup_env() {
    if [ ! -f .env ]; then
        echo "${YELLOW}📝 Criando arquivo .env a partir do .env.example...${NC}"
        cp .env.example .env
        echo "${GREEN}✓ Arquivo .env criado${NC}"
    else
        echo "${GREEN}✓ Arquivo .env já existe${NC}"
    fi
    echo ""
}

# Instalar/Atualizar dependências
install_dependencies() {
    echo "${YELLOW}📦 Verificando dependências do Composer...${NC}"
    
    if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
        echo "   Instalando dependências..."
        composer install --no-interaction --prefer-dist --optimize-autoloader
    else
        echo "${GREEN}✓ Dependências já instaladas${NC}"
    fi
    echo ""
}

# Gerar chave da aplicação
generate_app_key() {
    if ! grep -q "APP_KEY=base64:" .env; then
        echo "${YELLOW}🔑 Gerando chave da aplicação...${NC}"
        php artisan key:generate --ansi --force
        echo "${GREEN}✓ Chave gerada${NC}"
    else
        echo "${GREEN}✓ Chave da aplicação já existe${NC}"
    fi
    echo ""
}

# Limpar caches
clear_caches() {
    echo "${YELLOW}🧹 Limpando caches...${NC}"
    php artisan config:clear >/dev/null 2>&1 || true
    php artisan cache:clear >/dev/null 2>&1 || true
    php artisan route:clear >/dev/null 2>&1 || true
    php artisan view:clear >/dev/null 2>&1 || true
    echo "${GREEN}✓ Caches limpos${NC}"
    echo ""
}

# Configurar Swagger
setup_swagger() {
    echo "${YELLOW}📚 Configurando Swagger...${NC}"
    
    # Verificar se já foi publicado
    if [ ! -f "config/l5-swagger.php" ]; then
        php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider" --force
        echo "${GREEN}✓ Configuração do Swagger publicada${NC}"
    else
        echo "${GREEN}✓ Swagger já configurado${NC}"
    fi
    echo ""
}

# Executar migrations
run_migrations() {
    echo "${YELLOW}🗄️  Executando migrations...${NC}"
    
    if php artisan migrate --force 2>&1; then
        echo "${GREEN}✓ Migrations executadas com sucesso${NC}"
    else
        echo "${RED}✗ Erro ao executar migrations${NC}"
        return 1
    fi
    echo ""
}

# Executar seeders
run_seeders() {
    echo "${YELLOW}🌱 Executando seeders...${NC}"
    
    if php artisan db:seed --force 2>&1; then
        echo "${GREEN}✓ Seeders executados com sucesso${NC}"
    else
        echo "${YELLOW}⚠️  Nenhum seeder encontrado ou erro ao executar${NC}"
    fi
    echo ""
}

# Gerar documentação Swagger
generate_swagger_docs() {
    echo "${YELLOW}📖 Gerando documentação Swagger...${NC}"
    
    if php artisan l5-swagger:generate 2>&1; then
        echo "${GREEN}✓ Documentação Swagger gerada${NC}"
    else
        echo "${YELLOW}⚠️  Aviso ao gerar documentação Swagger${NC}"
    fi
    echo ""
}

# Criar link simbólico para storage
create_storage_link() {
    if [ ! -L "public/storage" ]; then
        echo "${YELLOW}🔗 Criando link simbólico para storage...${NC}"
        php artisan storage:link
        echo "${GREEN}✓ Link criado${NC}"
    else
        echo "${GREEN}✓ Link simbólico já existe${NC}"
    fi
    echo ""
}

# Otimizar aplicação (apenas em produção)
optimize_app() {
    if [ "${APP_ENV}" = "production" ]; then
        echo "${YELLOW}⚡ Otimizando aplicação para produção...${NC}"
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        echo "${GREEN}✓ Aplicação otimizada${NC}"
        echo ""
    fi
}

# Exibir informações finais
show_info() {
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${GREEN}✅ Aplicação pronta e funcionando!${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "${YELLOW}� Informações importantes:${NC}"
    echo "   🌐 API Backend:  http://localhost:8000"
    echo "   📚 Swagger API:  http://localhost:8000/api/documentation"
    echo "   🎨 Frontend:     http://localhost:3001"
    echo "   💾 PHPMyAdmin:   http://localhost:8080"
    echo ""
    echo "   📊 Ambiente:     ${APP_ENV:-local}"
    echo "   🐘 PHP versão:   $(php -v | head -n 1 | cut -d ' ' -f 2)"
    echo "   🗄️  Database:     ${DB_CONNECTION:-mysql}://${DB_HOST:-mysql}:${DB_PORT:-3306}/${DB_DATABASE:-estoque}"
    echo ""
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Executar todas as etapas
main() {
    # Aguardar MySQL
    wait_for_mysql
    
    # Setup inicial
    setup_env
    install_dependencies
    generate_app_key
    
    # Configurações
    clear_caches
    setup_swagger
    create_storage_link
    
    # Database
    run_migrations
    run_seeders
    
    # Documentação
    generate_swagger_docs
    
    # Otimizações
    optimize_app
    
    # Ajustar permissões finais
    echo "${YELLOW}🔒 Ajustando permissões finais...${NC}"
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true
    echo "${GREEN}✓ Permissões ajustadas${NC}"
    echo ""
    
    # Informações
    show_info
    
    # Iniciar PHP-FPM
    echo "${GREEN}🚀 Iniciando PHP-FPM...${NC}"
    echo ""
    exec php-fpm -F
}

# Executar função principal
main
