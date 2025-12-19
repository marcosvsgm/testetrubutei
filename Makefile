# ================================
# Sistema de Estoque - Makefile
# ================================
# Comandos úteis para gerenciar o projeto Docker
#
# Uso: make [comando]
# ================================

.PHONY: help build up down restart logs clean install dev prod test shell db-reset

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Variáveis
DOCKER_COMPOSE := docker-compose
BACKEND_CONTAINER := estoque-backend
FRONTEND_CONTAINER := estoque-frontend
MYSQL_CONTAINER := estoque-mysql

##@ Ajuda

help: ## Mostrar esta mensagem de ajuda
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)Sistema de Estoque - Comandos Disponíveis$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Desenvolvimento

dev: ## Iniciar ambiente de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando ambiente de desenvolvimento...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Ambiente iniciado!$(NC)"
	@make info

build: ## Construir todas as imagens Docker
	@echo "$(YELLOW)🔨 Construindo imagens Docker...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✅ Imagens construídas!$(NC)"

up: ## Subir todos os containers
	@echo "$(GREEN)⬆️  Subindo containers...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Containers iniciados!$(NC)"

down: ## Parar e remover todos os containers
	@echo "$(RED)⬇️  Parando containers...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

restart: ## Reiniciar todos os containers
	@echo "$(YELLOW)🔄 Reiniciando containers...$(NC)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✅ Containers reiniciados!$(NC)"

stop: ## Parar containers sem removê-los
	@echo "$(YELLOW)⏸️  Parando containers...$(NC)"
	$(DOCKER_COMPOSE) stop
	@echo "$(GREEN)✅ Containers parados!$(NC)"

##@ Logs e Monitoramento

logs: ## Ver logs de todos os containers
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Ver logs do backend
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Ver logs do frontend
	$(DOCKER_COMPOSE) logs -f frontend

logs-mysql: ## Ver logs do MySQL
	$(DOCKER_COMPOSE) logs -f mysql

logs-nginx: ## Ver logs do Nginx
	$(DOCKER_COMPOSE) logs -f nginx

ps: ## Listar containers em execução
	@echo "$(BLUE)📋 Containers em execução:$(NC)"
	$(DOCKER_COMPOSE) ps

info: ## Mostrar informações do ambiente
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)📋 Informações do Ambiente$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "🌐 Backend API:    http://localhost:8000"
	@echo "📚 Swagger:        http://localhost:8000/api/documentation"
	@echo "🎨 Frontend:       http://localhost:3001"
	@echo "💾 PHPMyAdmin:     http://localhost:8080"
	@echo "🗄️  MySQL:          localhost:3306"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

##@ Shell e Acesso

shell-backend: ## Abrir shell no container backend
	$(DOCKER_COMPOSE) exec backend sh

shell-frontend: ## Abrir shell no container frontend
	$(DOCKER_COMPOSE) exec frontend sh

shell-mysql: ## Abrir MySQL CLI
	$(DOCKER_COMPOSE) exec mysql mysql -uroot -proot estoque

##@ Banco de Dados

db-reset: ## Resetar banco de dados (migrate:fresh + seed)
	@echo "$(YELLOW)⚠️  Resetando banco de dados...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan migrate:fresh --seed --force
	@echo "$(GREEN)✅ Banco resetado!$(NC)"

db-migrate: ## Executar migrations
	@echo "$(YELLOW)🗄️  Executando migrations...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan migrate --force
	@echo "$(GREEN)✅ Migrations executadas!$(NC)"

db-seed: ## Executar seeders
	@echo "$(YELLOW)🌱 Executando seeders...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan db:seed --force
	@echo "$(GREEN)✅ Seeders executados!$(NC)"

db-backup: ## Backup do banco de dados
	@echo "$(YELLOW)💾 Criando backup...$(NC)"
	@mkdir -p ./backups
	$(DOCKER_COMPOSE) exec mysql mysqldump -uroot -proot estoque > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup criado em ./backups/$(NC)"

##@ Laravel Artisan

artisan: ## Executar comando artisan (use: make artisan cmd="seu comando")
	$(DOCKER_COMPOSE) exec backend php artisan $(cmd)

cache-clear: ## Limpar todos os caches
	@echo "$(YELLOW)🧹 Limpando caches...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan cache:clear
	$(DOCKER_COMPOSE) exec backend php artisan config:clear
	$(DOCKER_COMPOSE) exec backend php artisan route:clear
	$(DOCKER_COMPOSE) exec backend php artisan view:clear
	@echo "$(GREEN)✅ Caches limpos!$(NC)"

swagger: ## Gerar documentação Swagger
	@echo "$(YELLOW)📖 Gerando documentação Swagger...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan l5-swagger:generate
	@echo "$(GREEN)✅ Swagger gerado! Acesse: http://localhost:8000/api/documentation$(NC)"

##@ Instalação e Setup

install: build up ## Instalação completa (build + up)
	@echo "$(GREEN)✅ Instalação completa!$(NC)"
	@make info

fresh: ## Instalação limpa (remove tudo e reinstala)
	@echo "$(RED)⚠️  Removendo tudo...$(NC)"
	$(DOCKER_COMPOSE) down -v
	@make build
	@make up
	@echo "$(GREEN)✅ Instalação limpa concluída!$(NC)"

##@ Limpeza

clean: ## Limpar containers, volumes e imagens
	@echo "$(RED)🧹 Limpando ambiente Docker...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f
	@echo "$(GREEN)✅ Ambiente limpo!$(NC)"

clean-all: ## Limpeza completa (CUIDADO: remove TUDO)
	@echo "$(RED)⚠️  ATENÇÃO: Isso removerá TODOS os containers, volumes e imagens!$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v --remove-orphans; \
		docker system prune -af --volumes; \
		echo "$(GREEN)✅ Limpeza completa realizada!$(NC)"; \
	else \
		echo "$(YELLOW)❌ Cancelado$(NC)"; \
	fi

##@ Testes

test: ## Executar testes
	@echo "$(YELLOW)🧪 Executando testes...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan test
	@echo "$(GREEN)✅ Testes concluídos!$(NC)"

test-coverage: ## Executar testes com cobertura
	@echo "$(YELLOW)🧪 Executando testes com cobertura...$(NC)"
	$(DOCKER_COMPOSE) exec backend php artisan test --coverage
	@echo "$(GREEN)✅ Testes concluídos!$(NC)"

##@ Produção

prod-build: ## Build para produção
	@echo "$(YELLOW)🏗️  Construindo para produção...$(NC)"
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml build
	@echo "$(GREEN)✅ Build de produção concluído!$(NC)"

prod-up: ## Subir em modo produção
	@echo "$(GREEN)🚀 Iniciando em modo produção...$(NC)"
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✅ Produção iniciada!$(NC)"
