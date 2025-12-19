# 📚 Documentação da API com Swagger

## 🎯 Sobre

Este projeto inclui documentação interativa da API usando Swagger/OpenAPI 3.0, permitindo que você teste todos os endpoints diretamente pelo navegador.

## 🚀 Acessando o Swagger

Após iniciar o projeto com Docker, a documentação estará disponível em:

**URL:** [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)

## 🐳 Como Usar

### 1. Iniciar o Projeto

```bash
docker-compose up -d --build
```

### 2. Aguardar a Inicialização

O container irá automaticamente:
- Instalar todas as dependências PHP
- Publicar a configuração do Swagger
- Gerar a documentação da API
- Executar as migrations do banco de dados

### 3. Acessar o Swagger UI

Abra seu navegador e acesse: `http://localhost:8000/api/documentation`

## 📖 Endpoints Disponíveis

### Categorias
- `GET /api/categorias` - Listar todas as categorias
- `POST /api/categorias` - Criar nova categoria
- `GET /api/categorias/{id}` - Obter categoria específica
- `PUT /api/categorias/{id}` - Atualizar categoria
- `DELETE /api/categorias/{id}` - Excluir categoria

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `POST /api/produtos` - Criar novo produto
- `GET /api/produtos/{id}` - Obter produto específico
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Excluir produto

### Vendas
- `GET /api/vendas` - Listar todas as vendas
- `POST /api/vendas` - Criar nova venda
- `GET /api/vendas/{id}` - Obter venda específica
- `PUT /api/vendas/{id}` - Atualizar venda
- `DELETE /api/vendas/{id}` - Excluir venda

### Dashboard
- `GET /api/dashboard` - Estatísticas gerais
- `GET /api/dashboard/vendas-resumo` - Resumo de vendas

## 🧪 Testando a API

### No Swagger UI:

1. Clique no endpoint que deseja testar
2. Clique em "Try it out"
3. Preencha os parâmetros necessários
4. Clique em "Execute"
5. Veja a resposta da API

### Exemplo de Teste - Criar Categoria:

1. Acesse: `POST /api/categorias`
2. Clique em "Try it out"
3. Cole este JSON no corpo da requisição:

```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral",
  "ativo": true
}
```

4. Clique em "Execute"
5. Verifique o código de resposta (201 = sucesso)

## 🔧 Regenerar Documentação

Se você adicionar novos endpoints ou modificar os existentes:

```bash
# Acessar o container
docker exec -it estoque-backend bash

# Regenerar documentação
php artisan l5-swagger:generate
```

## 📝 Adicionando Novos Endpoints

Para documentar um novo endpoint, adicione anotações OpenAPI ao controller:

```php
/**
 * @OA\Get(
 *     path="/api/seu-endpoint",
 *     tags={"Sua Tag"},
 *     summary="Descrição curta",
 *     description="Descrição detalhada",
 *     @OA\Response(
 *         response=200,
 *         description="Sucesso",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer"),
 *             @OA\Property(property="nome", type="string")
 *         )
 *     )
 * )
 */
public function seuMetodo() {
    // seu código
}
```

Depois regenere a documentação com: `php artisan l5-swagger:generate`

## 🎨 Personalização

### Modo Escuro

Edite o arquivo `.env` e adicione:

```env
L5_SWAGGER_UI_DARK_MODE=true
```

### URL Base

Para mudar a URL base da API:

```env
L5_SWAGGER_CONST_HOST=http://seu-dominio.com/api
```

## 📚 Recursos Adicionais

- [Documentação OpenAPI](https://swagger.io/specification/)
- [L5-Swagger no GitHub](https://github.com/DarkaOnLine/L5-Swagger)
- [Swagger Editor Online](https://editor.swagger.io/)

## 🐛 Troubleshooting

### Swagger não está acessível

1. Verifique se o container está rodando:
   ```bash
   docker ps
   ```

2. Verifique os logs:
   ```bash
   docker logs estoque-backend
   ```

3. Regenere a documentação:
   ```bash
   docker exec -it estoque-backend php artisan l5-swagger:generate
   ```

### Erro de permissão

```bash
docker exec -it estoque-backend chown -R www-data:www-data /var/www/storage
docker exec -it estoque-backend chmod -R 775 /var/www/storage
```

### Limpar cache

```bash
docker exec -it estoque-backend php artisan config:clear
docker exec -it estoque-backend php artisan cache:clear
docker exec -it estoque-backend php artisan route:clear
```

## ✅ Checklist de Verificação

- [ ] Docker está instalado e rodando
- [ ] Executou `docker-compose up -d --build`
- [ ] Aguardou a inicialização completa (~30 segundos)
- [ ] Acessou `http://localhost:8000/api/documentation`
- [ ] Vê a interface do Swagger com todos os endpoints

## 🎉 Pronto!

Agora você pode explorar e testar toda a API diretamente pelo navegador!
