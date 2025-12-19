# 🚀 Sistema de Estoque - Backend API

API REST desenvolvida em Laravel 12 com documentação interativa Swagger/OpenAPI.

## 📚 Documentação da API (Swagger)

Após iniciar o projeto com Docker, acesse a documentação interativa:

**🔗 http://localhost:8000/api/documentation**

## 🎯 Recursos da API

### Categorias
- Listar, criar, editar e excluir categorias de produtos
- Busca por nome
- Paginação

### Produtos
- Gerenciamento completo de produtos
- Relacionamento com categorias
- Controle de estoque
- Busca e filtros

### Vendas
- Registro de vendas
- Histórico de vendas
- Relatórios

### Dashboard
- Estatísticas gerais
- Resumo de vendas
- Métricas em tempo real

## 🐳 Iniciar com Docker

```bash
# Na raiz do projeto
docker-compose up -d --build
```

O container irá automaticamente:
1. Instalar dependências PHP (Composer)
2. Configurar o banco de dados MySQL
3. Executar migrations
4. Executar seeders (dados de exemplo)
5. Publicar e gerar documentação Swagger
6. Iniciar o servidor PHP-FPM

## 🧪 Testando a API

### Via Swagger (Recomendado)
1. Acesse: http://localhost:8000/api/documentation
2. Escolha um endpoint
3. Clique em "Try it out"
4. Preencha os parâmetros
5. Clique em "Execute"
6. Veja a resposta!

### Via cURL
```bash
# Listar categorias
curl http://localhost:8000/api/categorias

# Criar categoria
curl -X POST http://localhost:8000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eletrônicos","descricao":"Produtos eletrônicos","ativo":true}'
```

### Via Postman/Insomnia
- Base URL: `http://localhost:8000/api`
- Headers: `Content-Type: application/json`

## 📋 Endpoints Disponíveis

### Categorias
```
GET    /api/categorias       - Listar todas
POST   /api/categorias       - Criar nova
GET    /api/categorias/{id}  - Ver detalhes
PUT    /api/categorias/{id}  - Atualizar
DELETE /api/categorias/{id}  - Excluir
```

### Produtos
```
GET    /api/produtos       - Listar todos
POST   /api/produtos       - Criar novo
GET    /api/produtos/{id}  - Ver detalhes
PUT    /api/produtos/{id}  - Atualizar
DELETE /api/produtos/{id}  - Excluir
```

### Vendas
```
GET    /api/vendas       - Listar todas
POST   /api/vendas       - Criar nova
GET    /api/vendas/{id}  - Ver detalhes
PUT    /api/vendas/{id}  - Atualizar
DELETE /api/vendas/{id}  - Excluir
```

### Dashboard
```
GET /api/dashboard              - Estatísticas gerais
GET /api/dashboard/vendas-resumo - Resumo de vendas
```

## 🛠️ Desenvolvimento

### Acessar o container
```bash
docker exec -it estoque-backend bash
```

### Comandos úteis dentro do container

```bash
# Executar migrations
php artisan migrate

# Executar seeders
php artisan db:seed

# Resetar banco de dados
php artisan migrate:fresh --seed

# Gerar documentação Swagger
php artisan l5-swagger:generate

# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rotas
php artisan route:list
```

## 📦 Dependências Principais

- **Laravel 12** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **L5-Swagger** - Documentação OpenAPI/Swagger
- **PHP 8.2** - Linguagem

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Banco de Dados
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=estoque
DB_USERNAME=estoque
DB_PASSWORD=estoque

# Swagger
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api
L5_SWAGGER_USE_ABSOLUTE_PATH=true
```

## 📖 Documentação Adicional

- [README_API.md](README_API.md) - Documentação detalhada da API
- [README_SEEDERS.md](README_SEEDERS.md) - Informações sobre seeders
- [CHANGELOG.md](CHANGELOG.md) - Histórico de mudanças
- [../../SWAGGER_README.md](../../SWAGGER_README.md) - Guia completo do Swagger

## 🐛 Troubleshooting

### Swagger não está acessível
```bash
docker exec -it estoque-backend php artisan l5-swagger:generate
docker exec -it estoque-backend php artisan config:clear
```

### Erro de permissão
```bash
docker exec -it estoque-backend chown -R www-data:www-data /var/www/storage
docker exec -it estoque-backend chmod -R 775 /var/www/storage
```

### Erro de conexão com banco
```bash
docker-compose restart mysql
# Aguarde 10 segundos
docker-compose restart backend
```

### Ver logs
```bash
docker logs estoque-backend
docker logs estoque-mysql
```

## 📝 Adicionando Novos Endpoints

1. Crie o controller ou método
2. Adicione as anotações OpenAPI/Swagger
3. Registre a rota em `routes/api.php`
4. Regenere a documentação

Exemplo de anotação:

```php
/**
 * @OA\Get(
 *     path="/api/seu-endpoint",
 *     tags={"Sua Tag"},
 *     summary="Descrição",
 *     @OA\Response(
 *         response=200,
 *         description="Sucesso"
 *     )
 * )
 */
public function seuMetodo() {
    // código
}
```

## 🎉 Pronto!

Agora você pode:
- ✅ Desenvolver e testar a API
- ✅ Ver documentação interativa no Swagger
- ✅ Fazer requisições diretamente pelo navegador
- ✅ Integrar com o frontend React

**Acesse agora:** http://localhost:8000/api/documentation
