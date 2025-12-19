# 🚀 Guia Rápido de Instalação com Swagger

## Passos para Iniciar o Projeto

### 1. Clone ou baixe o projeto

### 2. Navegue até a pasta do projeto
```bash
cd estoque
```

### 3. Inicie os containers Docker
```bash
docker-compose up -d --build
```

### 4. Aguarde a inicialização (aproximadamente 30-60 segundos)

### 5. Acesse as aplicações:

#### 🎨 Frontend (React)
- **URL:** http://localhost:3001

#### 📚 API com Swagger (Documentação Interativa)
- **URL:** http://localhost:8000/api/documentation
- Aqui você pode testar TODOS os endpoints da API

#### 🔧 API Backend (Laravel)
- **Base URL:** http://localhost:8000/api

#### 💾 phpMyAdmin (Gerenciar Banco de Dados)
- **URL:** http://localhost:8080
- **Usuário:** root
- **Senha:** root

## 🎯 O que é o Swagger?

O Swagger é uma interface interativa que permite:

- ✅ Ver todos os endpoints disponíveis
- ✅ Testar requisições diretamente pelo navegador
- ✅ Ver exemplos de respostas
- ✅ Validar payloads JSON
- ✅ Entender a estrutura da API sem precisar de ferramentas externas

## 📱 Testando sua primeira requisição no Swagger

1. Acesse: http://localhost:8000/api/documentation
2. Procure por "Categorias"
3. Clique em `GET /api/categorias`
4. Clique no botão "Try it out"
5. Clique em "Execute"
6. Veja a resposta da API!

## 🔄 Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f
```

### Acessar o container do backend
```bash
docker exec -it estoque-backend bash
```

### Regenerar documentação do Swagger
```bash
docker exec -it estoque-backend php artisan l5-swagger:generate
```

### Executar migrations novamente
```bash
docker exec -it estoque-backend php artisan migrate:fresh --seed
```

## ❓ Problemas Comuns

### Swagger não carrega?
```bash
docker exec -it estoque-backend php artisan l5-swagger:generate
docker exec -it estoque-backend php artisan config:clear
```

### Erro de conexão com banco de dados?
```bash
docker-compose restart mysql
```
Aguarde 10 segundos e tente novamente.

### Portas já em uso?
Edite o arquivo `docker-compose.yml` e mude as portas:
- Frontend: porta 3001
- Backend: porta 8000
- phpMyAdmin: porta 8080
- MySQL: porta 3306

## 🎉 Pronto para Usar!

Agora você tem:
- ✅ Backend Laravel rodando
- ✅ Frontend React rodando
- ✅ Banco de dados MySQL
- ✅ Documentação Swagger interativa
- ✅ phpMyAdmin para gerenciar dados

**Comece testando a API em:** http://localhost:8000/api/documentation
