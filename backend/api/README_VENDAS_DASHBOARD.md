# API de Vendas e Dashboard - Sistema de Estoque

## 📋 Endpoints Disponíveis

### Vendas

#### 1. Listar Todas as Vendas
```http
GET /api/vendas
```

**Query Parameters:**
- `status` (opcional): Filtrar por status (pendente, concluida, cancelada, todas)
- `data_inicio` (opcional): Data inicial para filtro (formato: YYYY-MM-DD)
- `data_fim` (opcional): Data final para filtro (formato: YYYY-MM-DD)

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "produto": "Notebook Dell",
    "categoria": "Eletrônicos",
    "cliente": "João Silva",
    "quantidade": 2,
    "valorUnitario": 3500.00,
    "valorTotal": 7000.00,
    "status": "concluida",
    "observacoes": null,
    "data": "2025-12-18",
    "data_completa": "2025-12-18 14:30:00"
  }
]
```

#### 2. Criar Nova Venda
```http
POST /api/vendas
```

**Body:**
```json
{
  "produto_id": 1,
  "cliente": "João Silva",
  "quantidade": 2,
  "valor_unitario": 3500.00,
  "status": "pendente",
  "observacoes": "Entrega urgente"
}
```

**Validações:**
- `produto_id`: obrigatório, deve existir na tabela produtos
- `cliente`: obrigatório, string, máximo 255 caracteres
- `quantidade`: obrigatório, inteiro, mínimo 1
- `valor_unitario`: obrigatório, numérico, mínimo 0
- `status`: opcional, valores: pendente, concluida, cancelada (padrão: pendente)
- `observacoes`: opcional, string

**Funcionalidades:**
- ✅ Calcula automaticamente o valor_total (quantidade × valor_unitario)
- ✅ Verifica se há estoque disponível antes de criar a venda
- ✅ Atualiza automaticamente o estoque do produto
- ✅ Não desconta do estoque se o status for "cancelada"

**Resposta de Sucesso (201):**
```json
{
  "message": "Venda criada com sucesso",
  "venda": {
    "id": 1,
    "produto": "Notebook Dell",
    "categoria": "Eletrônicos",
    "cliente": "João Silva",
    "quantidade": 2,
    "valorUnitario": 3500.00,
    "valorTotal": 7000.00,
    "status": "pendente",
    "observacoes": "Entrega urgente",
    "data": "2025-12-18"
  }
}
```

**Resposta de Erro - Estoque Insuficiente (400):**
```json
{
  "message": "Estoque insuficiente",
  "estoque_disponivel": 5
}
```

#### 3. Buscar Venda por ID
```http
GET /api/vendas/{id}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "produto": "Notebook Dell",
  "produto_id": 1,
  "categoria": "Eletrônicos",
  "cliente": "João Silva",
  "quantidade": 2,
  "valorUnitario": 3500.00,
  "valorTotal": 7000.00,
  "status": "concluida",
  "observacoes": null,
  "data": "2025-12-18",
  "data_completa": "2025-12-18 14:30:00"
}
```

#### 4. Atualizar Venda
```http
PUT /api/vendas/{id}
PATCH /api/vendas/{id}
```

**Body (todos os campos são opcionais):**
```json
{
  "cliente": "João Silva Junior",
  "quantidade": 3,
  "valor_unitario": 3400.00,
  "status": "concluida",
  "observacoes": "Atualização de pedido"
}
```

**Funcionalidades:**
- ✅ Ajusta automaticamente o estoque ao alterar a quantidade
- ✅ Devolve produtos ao estoque se o status mudar para "cancelada"
- ✅ Recalcula o valor_total automaticamente

**Resposta de Sucesso (200):**
```json
{
  "message": "Venda atualizada com sucesso",
  "venda": { ... }
}
```

#### 5. Excluir Venda
```http
DELETE /api/vendas/{id}
```

**Funcionalidades:**
- ✅ Devolve automaticamente os produtos ao estoque (se não estava cancelada)

**Resposta de Sucesso (200):**
```json
{
  "message": "Venda excluída com sucesso"
}
```

---

### Dashboard

#### 1. Obter Estatísticas do Dashboard
```http
GET /api/dashboard
```

**Resposta de Sucesso (200):**
```json
{
  "stats": {
    "totalProdutos": 150,
    "totalCategorias": 12,
    "vendasHoje": 15,
    "valorTotalHoje": 8500.00,
    "vendasMes": 145,
    "valorTotalMes": 125000.00,
    "produtosEstoqueBaixo": 8
  },
  "ultimasAtividades": [
    {
      "icon": "✅",
      "title": "Venda: Notebook Dell",
      "description": "Cliente: João Silva",
      "time": "há 5 minutos",
      "valor": 7000.00
    }
  ],
  "produtosMaisVendidos": [
    {
      "name": "Notebook Dell",
      "sales": 45,
      "percentage": 100
    },
    {
      "name": "Mouse Logitech",
      "sales": 38,
      "percentage": 84.4
    }
  ],
  "vendasPorCategoria": [
    {
      "nome": "Eletrônicos",
      "total": 85
    },
    {
      "nome": "Periféricos",
      "total": 60
    }
  ],
  "vendasUltimos7Dias": [
    {
      "data": "12/12",
      "valor": 5500.00
    },
    {
      "data": "13/12",
      "valor": 7200.00
    }
  ]
}
```

**Dados Retornados:**
- **stats**: Estatísticas gerais do sistema
  - Contagem de produtos ativos
  - Contagem de categorias
  - Vendas realizadas hoje (exceto canceladas)
  - Valor total de vendas hoje
  - Vendas do mês atual
  - Valor total de vendas do mês
  - Produtos com estoque baixo (< 10 unidades)

- **ultimasAtividades**: Últimas 10 vendas com tempo relativo
- **produtosMaisVendidos**: Top 5 produtos mais vendidos
- **vendasPorCategoria**: Total de vendas agrupadas por categoria
- **vendasUltimos7Dias**: Gráfico de vendas dos últimos 7 dias

#### 2. Obter Resumo de Vendas
```http
GET /api/dashboard/vendas-resumo
```

**Query Parameters:**
- `periodo` (opcional): hoje, semana, mes, ano

**Exemplo:**
```http
GET /api/dashboard/vendas-resumo?periodo=mes
```

**Resposta de Sucesso (200):**
```json
{
  "totalVendas": 145,
  "valorTotal": 125000.00,
  "vendasPendentes": 12,
  "vendasConcluidas": 120,
  "vendasCanceladas": 13,
  "ticketMedio": 862.07
}
```

---

## 🗃️ Estrutura do Banco de Dados

### Tabela: vendas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | ID único da venda |
| produto_id | bigint | ID do produto (FK) |
| cliente | string(255) | Nome do cliente |
| quantidade | integer | Quantidade vendida |
| valor_unitario | decimal(10,2) | Valor unitário do produto |
| valor_total | decimal(10,2) | Valor total (calculado automaticamente) |
| status | enum | pendente, concluida, cancelada |
| observacoes | text | Observações adicionais (opcional) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

**Relacionamentos:**
- `vendas.produto_id` → `produtos.id` (CASCADE on delete)

---

## 🚀 Como Executar

### 1. Rodar as Migrations
```bash
php artisan migrate
```

### 2. Popular com Dados de Exemplo (Opcional)
```bash
php artisan db:seed --class=VendaSeeder
```
Isso criará 50 vendas de exemplo dos últimos 30 dias.

---

## 💡 Regras de Negócio

### Gestão de Estoque
1. **Ao criar uma venda**: O estoque é automaticamente decrementado (se status ≠ cancelada)
2. **Ao atualizar quantidade**: O estoque é ajustado pela diferença
3. **Ao cancelar uma venda**: Os produtos são devolvidos ao estoque
4. **Ao excluir uma venda**: Os produtos são devolvidos ao estoque (se não estava cancelada)

### Validações
- Não é possível criar/atualizar venda se não houver estoque suficiente
- O valor_total é sempre calculado automaticamente
- Todas as consultas de vendas excluem vendas canceladas nos cálculos de valor

### Filtros
- Dashboard mostra apenas vendas não canceladas nos totais
- É possível filtrar vendas por status, data inicial e data final
- Resumo de vendas pode ser filtrado por período (hoje, semana, mês, ano)

---

## 📊 Exemplos de Uso

### Criar uma venda completa
```bash
curl -X POST http://localhost:8000/api/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "cliente": "Maria Santos",
    "quantidade": 2,
    "valor_unitario": 150.00,
    "status": "concluida",
    "observacoes": "Pagamento à vista"
  }'
```

### Filtrar vendas concluídas
```bash
curl http://localhost:8000/api/vendas?status=concluida
```

### Buscar dados do dashboard
```bash
curl http://localhost:8000/api/dashboard
```

### Obter resumo de vendas do mês
```bash
curl http://localhost:8000/api/dashboard/vendas-resumo?periodo=mes
```

---

## ⚠️ Tratamento de Erros

Todos os endpoints retornam erros padronizados:

**400 Bad Request**: Estoque insuficiente
**404 Not Found**: Venda não encontrada
**422 Unprocessable Entity**: Dados de validação inválidos
**500 Internal Server Error**: Erro no servidor

Exemplo de erro:
```json
{
  "message": "Erro ao criar venda",
  "error": "Descrição do erro"
}
```
