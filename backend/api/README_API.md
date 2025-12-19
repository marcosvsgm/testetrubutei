# API Backend - Sistema de Estoque

API RESTful desenvolvida em Laravel para gerenciamento de estoque.

## ✨ Funcionalidades

### Categorias
- **GET** `/api/categorias` - Listar todas as categorias
- **GET** `/api/categorias/{id}` - Buscar categoria específica
- **POST** `/api/categorias` - Criar nova categoria
- **PUT** `/api/categorias/{id}` - Atualizar categoria
- **DELETE** `/api/categorias/{id}` - Excluir categoria

### Produtos
- **GET** `/api/produtos` - Listar todos os produtos
- **GET** `/api/produtos/{id}` - Buscar produto específico
- **POST** `/api/produtos` - Criar novo produto
- **PUT** `/api/produtos/{id}` - Atualizar produto
- **DELETE** `/api/produtos/{id}` - Excluir produto

## 🚀 Como executar

### Usando Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d

# Acessar o container do backend
docker exec -it estoque-backend bash

# Dentro do container, instalar dependências
composer install

# Configurar o arquivo .env
cp .env.example .env

# Gerar a chave da aplicação
php artisan key:generate

# Executar as migrations
php artisan migrate

# Sair do container
exit
```

### Sem Docker

```bash
cd backend/api

# Instalar dependências
composer install

# Configurar o arquivo .env
cp .env.example .env

# Gerar a chave da aplicação
php artisan key:generate

# Configurar as credenciais do banco de dados no .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=estoque
# DB_USERNAME=root
# DB_PASSWORD=

# Executar as migrations
php artisan migrate

# Iniciar o servidor
php artisan serve
```

## 📊 Estrutura do Banco de Dados

### Tabela: categorias
- `id` - ID auto incremento
- `nome` - Nome da categoria (obrigatório)
- `descricao` - Descrição da categoria (opcional)
- `ativo` - Status ativo/inativo (padrão: true)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: produtos
- `id` - ID auto incremento
- `nome` - Nome do produto (obrigatório)
- `descricao` - Descrição do produto (opcional)
- `codigo` - Código único do produto (opcional)
- `preco` - Preço do produto (obrigatório)
- `quantidade` - Quantidade em estoque (obrigatório)
- `categoria_id` - FK para categorias (opcional)
- `ativo` - Status ativo/inativo (padrão: true)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## 📝 Exemplos de Requisições

### Criar Categoria
```bash
curl -X POST http://localhost:8000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral",
    "ativo": true
  }'
```

### Criar Produto
```bash
curl -X POST http://localhost:8000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell",
    "descricao": "Notebook Dell Inspiron 15",
    "codigo": "DELL-001",
    "preco": 2500.00,
    "quantidade": 10,
    "categoria_id": 1,
    "ativo": true
  }'
```

## 🔧 Tecnologias

- PHP 8.2
- Laravel 11
- MySQL 8.0
- Docker

## 📌 URLs

- **API**: http://localhost:8000
- **PHPMyAdmin**: http://localhost:8080
