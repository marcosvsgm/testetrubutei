# 🌱 Seeders - População do Banco de Dados

## 📊 Quantidade de Dados

Este sistema está configurado para popular o banco de dados com:

- **500 Categorias**
- **50.000 Produtos**
- **500 Vendas** (dos últimos 90 dias)
- **1 Usuário** administrador

## 🚀 Como Executar

### Opção 1: Executar Todos os Seeders de Uma Vez

```bash
# Dentro do container Docker
docker-compose exec backend php artisan db:seed

# Ou se estiver dentro do container
php artisan db:seed
```

Este comando executará todos os seeders na ordem correta:
1. CategoriaSeeder (500 categorias)
2. ProdutoSeeder (50.000 produtos)
3. VendaSeeder (500 vendas)

### Opção 2: Executar Seeders Individuais

```bash
# Apenas categorias
docker-compose exec backend php artisan db:seed --class=CategoriaSeeder

# Apenas produtos (requer categorias criadas primeiro)
docker-compose exec backend php artisan db:seed --class=ProdutoSeeder

# Apenas vendas (requer produtos criados primeiro)
docker-compose exec backend php artisan db:seed --class=VendaSeeder
```

### Opção 3: Migrar e Popular ao Mesmo Tempo

```bash
# Desfazer todas as migrations e executar novamente com seed
docker-compose exec backend php artisan migrate:fresh --seed
```

⚠️ **ATENÇÃO**: Este comando apagará todos os dados existentes!

## ⏱️ Tempo Estimado de Execução

- **Categorias** (500): ~2-5 segundos
- **Produtos** (50.000): ~30-60 segundos
- **Vendas** (500): ~5-10 segundos
- **Total**: ~40-75 segundos

*Os tempos podem variar dependendo do hardware e configuração do Docker*

## 📝 Detalhes dos Dados Criados

### Categorias (500)
- Nomes variados baseados em setores reais (Eletrônicos, Informática, Moda, etc.)
- Subcategorias (Premium, Básico, Profissional, etc.)
- Todas com descrições

### Produtos (50.000)
- Nomes combinando marca + tipo + modelo + número único
- Códigos únicos no formato `PROD000001` até `PROD050000`
- Preços variados entre R$ 5,00 e R$ 5.000,00
- Quantidades em estoque entre 0 e 500 unidades
- 95% dos produtos ativos, 5% inativos
- Distribuídos aleatoriamente entre as 500 categorias

Exemplos de produtos:
- "Dell Notebook Pro #1234"
- "Logitech Mouse Gamer #5678"
- "Samsung Smartphone Max #9012"

### Vendas (500)
- Distribuídas nos últimos 90 dias (3 meses)
- 50 clientes diferentes com nomes variados
- Quantidades entre 1 e 10 unidades
- Status: concluída, pendente ou cancelada
- Algumas com observações especiais
- Horários variados (0h às 23h)

Status de vendas:
- **Concluída**: Venda finalizada
- **Pendente**: Aguardando confirmação
- **Cancelada**: Venda cancelada

## 🔄 Performance e Otimização

Os seeders foram otimizados para melhor performance:

### CategoriaSeeder
- Insere em lotes de 100 registros
- Usa `DB::table()->insert()` para bulk insert
- Mostra progresso a cada lote

### ProdutoSeeder
- Insere em lotes de 1.000 registros
- Usa timestamps únicos para evitar overhead
- Mostra progresso a cada 1.000 produtos
- Usa IDs de categorias em array para acesso rápido

### VendaSeeder
- Insere em lotes de 100 registros
- Usa IDs de produtos em array
- Datas e horários aleatórios nos últimos 90 dias
- Mostra progresso a cada lote

## 🗑️ Limpar e Recriar Dados

### Opção 1: Limpar e popular novamente
```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

### Opção 2: Apenas limpar tabelas específicas
```bash
# Entrar no MySQL
docker-compose exec mysql mysql -u estoque -pestoque estoque

# Limpar tabelas
TRUNCATE TABLE vendas;
TRUNCATE TABLE produtos;
TRUNCATE TABLE categorias;

# Sair
exit

# Popular novamente
docker-compose exec backend php artisan db:seed
```

## 📊 Verificar Dados Criados

### Via MySQL
```bash
docker-compose exec mysql mysql -u estoque -pestoque estoque

# Contar registros
SELECT COUNT(*) FROM categorias;
SELECT COUNT(*) FROM produtos;
SELECT COUNT(*) FROM vendas;

# Ver exemplos
SELECT * FROM categorias LIMIT 5;
SELECT * FROM produtos LIMIT 5;
SELECT * FROM vendas LIMIT 5;
```

### Via Laravel Tinker
```bash
docker-compose exec backend php artisan tinker

# Contar
\App\Models\Categoria::count();
\App\Models\Produto::count();
\App\Models\Venda::count();

# Ver exemplos
\App\Models\Produto::with('categoria')->limit(5)->get();
\App\Models\Venda::with('produto')->limit(5)->get();
```

### Via phpMyAdmin
Acesse: http://localhost:8080
- Servidor: `mysql`
- Usuário: `root`
- Senha: `root`
- Database: `estoque`

## 🐛 Solução de Problemas

### Erro: "Nenhum produto encontrado"
Certifique-se de executar os seeders na ordem:
```bash
docker-compose exec backend php artisan db:seed --class=CategoriaSeeder
docker-compose exec backend php artisan db:seed --class=ProdutoSeeder
docker-compose exec backend php artisan db:seed --class=VendaSeeder
```

### Erro: "SQLSTATE[23000]: Integrity constraint violation"
O banco já possui dados. Use `migrate:fresh` para limpar:
```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

### Processo muito lento
- Verifique os recursos do Docker (aumente RAM/CPU se necessário)
- Os dados estão sendo inseridos em lotes para melhor performance
- Aguarde a conclusão, pode levar até 2 minutos

### Container parou durante o seed
- Aumente a memória do container MySQL no docker-compose.yml
- Reinicie os containers: `docker-compose restart`

## 💡 Dicas

1. **Primeira vez**: Use `migrate:fresh --seed` para garantir banco limpo
2. **Testes**: Crie um seeder menor para testes rápidos
3. **Backup**: Exporte o banco após popular para reutilizar
4. **Produção**: NUNCA execute seeders em produção com dados reais

## 📦 Exportar Dados Populados

```bash
# Criar backup do banco populado
docker-compose exec mysql mysqldump -u estoque -pestoque estoque > backup_estoque.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u estoque -pestoque estoque < backup_estoque.sql
```
