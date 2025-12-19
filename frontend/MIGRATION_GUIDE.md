# 🎯 Tutorial: Aplicando Animações aos Componentes Existentes

## 📋 Passo a Passo para Migrar Componentes

### 1️⃣ Instalar Dependências

Execute no terminal do frontend:

```bash
cd frontend
npm install framer-motion react-hot-toast
npm install -D typescript @types/node
```

### 2️⃣ Importar Estilos no main.jsx

Adicione no arquivo `src/main.jsx`:

```jsx
import './styles/Animations.css'
```

### 3️⃣ Adicionar ToastProvider no App

No arquivo `App.jsx`, adicione o ToastProvider:

```jsx
import { ToastProvider } from './components/ToastProvider'

function App() {
  return (
    <div className="app-layout">
      <ToastProvider />  {/* Adicionar aqui */}
      {/* resto do código */}
    </div>
  )
}
```

### 4️⃣ Substituir Alerts por Toast

**Em todos os componentes (Produtos, Categorias, Vendas):**

#### Importar no topo:
```jsx
import toast from 'react-hot-toast'
```

#### Substituir setSuccess:
```jsx
// ANTES:
setSuccess('Produto salvo com sucesso!')

// DEPOIS:
toast.success('✅ Produto salvo com sucesso!')
```

#### Substituir setError:
```jsx
// ANTES:
setError('Erro ao salvar produto')

// DEPOIS:
toast.error('❌ Erro ao salvar produto')
```

#### Remover renderização de alerts:
```jsx
// REMOVER estas linhas:
{error && <div className="alert alert-error">{error}</div>}
{success && <div className="alert alert-success">{success}</div>}
```

### 5️⃣ Adicionar Skeleton Loading

**Em Produtos.jsx, Categorias.jsx e Vendas.jsx:**

#### Importar:
```jsx
import { SkeletonTable } from './SkeletonLoader'
```

#### Substituir loading:
```jsx
// ANTES:
if (loading) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Carregando...</div>
    </div>
  )
}

// DEPOIS:
if (loading && !isRetrying) {
  return (
    <div className="produtos"> {/* ou categorias/vendas */}
      <SkeletonTable rows={5} />
    </div>
  )
}
```

### 6️⃣ Animar Botões

**Substituir botões principais:**

#### Importar:
```jsx
import { LoadingButton } from './AnimationComponents'
```

#### Botão Novo:
```jsx
// ANTES:
<button className="btn-novo-produto" onClick={handleCreate}>
  <span>➕</span> Novo Produto
</button>

// DEPOIS:
<LoadingButton className="btn-novo-produto" onClick={handleCreate}>
  <span>➕</span> Novo Produto
</LoadingButton>
```

#### Botões de Ação (Editar/Deletar):
```jsx
// ANTES:
<button className="btn-editar" onClick={() => handleEdit(produto)}>
  ✏️ Editar
</button>

// DEPOIS:
<LoadingButton className="btn-editar" onClick={() => handleEdit(produto)}>
  ✏️ Editar
</LoadingButton>
```

### 7️⃣ Animar Modal

**Substituir modais por AnimatedModal:**

#### Importar:
```jsx
import { AnimatedModal } from './AnimationComponents'
```

#### Substituir modal:
```jsx
// ANTES:
{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* conteúdo */}
    </div>
  </div>
)}

// DEPOIS:
<AnimatedModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  className="bulk-modal"
>
  {/* conteúdo */}
</AnimatedModal>
```

### 8️⃣ Animar Linhas da Tabela

**Adicionar animação nas linhas:**

#### Importar:
```jsx
import { motion } from 'framer-motion'
```

#### Modificar table-row:
```jsx
// ANTES:
<div key={produto.id} className="table-row">
  {/* conteúdo */}
</div>

// DEPOIS:
<motion.div 
  key={produto.id} 
  className="table-row"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  whileHover={{ x: 5 }}
>
  {/* conteúdo */}
</motion.div>
```

### 9️⃣ Shake em Campos Inválidos

**Adicionar shake em formulários:**

#### Importar:
```jsx
import { ShakeContainer } from './AnimationComponents'
import { useState } from 'react'
```

#### Adicionar state:
```jsx
const [shakeField, setShakeField] = useState('')
```

#### Envolver input:
```jsx
<ShakeContainer shake={shakeField === 'nome'}>
  <input
    type="text"
    name="nome"
    value={formData.nome}
    onChange={handleChange}
  />
</ShakeContainer>
```

#### Ao validar:
```jsx
if (!formData.nome) {
  setShakeField('nome')
  setTimeout(() => setShakeField(''), 400)
  toast.error('❌ Nome é obrigatório!')
  return
}
```

### 🔟 Animar Dashboard

**Substituir Dashboard.jsx por DashboardAnimated.tsx** ou adicionar:

#### Importar:
```jsx
import { AnimatedCounter, FadeIn, StaggerContainer, StaggerItem } from './AnimationComponents'
import { motion } from 'framer-motion'
```

#### Animar cards:
```jsx
<StaggerContainer className="dashboard-cards">
  {cards.map((card, index) => (
    <StaggerItem key={index}>
      <motion.div 
        className="dashboard-card"
        whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)' }}
      >
        {/* conteúdo */}
      </motion.div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

#### Animar contadores:
```jsx
// ANTES:
<p className="card-value">{totalVendas}</p>

// DEPOIS:
<p className="card-value">
  <AnimatedCounter value={totalVendas} />
</p>
```

---

## 🎨 Exemplo Completo: Produtos.jsx com Animações

```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getProdutos, deleteProduto } from '../services/api'
import { SkeletonTable } from './SkeletonLoader'
import { LoadingButton, AnimatedModal, ShakeContainer } from './AnimationComponents'
import ProdutoModal from './ProdutoModal'
import '../styles/Produtos.css'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [shakeField, setShakeField] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await getProdutos(1, '', 1000)
      setProdutos(response.data.data || response.data)
    } catch (err) {
      toast.error('❌ Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduto(id)
      toast.success('✅ Produto excluído com sucesso!')
      loadData()
    } catch (err) {
      toast.error('❌ Erro ao excluir produto')
    }
  }

  if (loading) {
    return (
      <div className="produtos">
        <SkeletonTable rows={10} />
      </div>
    )
  }

  return (
    <div className="produtos">
      <motion.div 
        className="produtos-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Produtos</h1>
          <p className="produtos-subtitle">Gerencie seu estoque</p>
        </div>
        <LoadingButton 
          className="btn-novo-produto" 
          onClick={() => setShowModal(true)}
        >
          <span>➕</span> Novo Produto
        </LoadingButton>
      </motion.div>

      <div className="produtos-lista">
        <div className="produtos-table">
          <div className="table-header">
            <div>ID</div>
            <div>SKU</div>
            <div>Nome</div>
            <div>Categoria</div>
            <div>Preço</div>
            <div>Quantidade</div>
            <div>Status</div>
            <div>Ações</div>
          </div>
          {produtos.map((produto, index) => (
            <motion.div
              key={produto.id}
              className="table-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <div className="table-cell">#{produto.id}</div>
              <div className="table-cell">{produto.sku}</div>
              <div className="table-cell">
                <strong>{produto.nome}</strong>
              </div>
              <div className="table-cell">{produto.categoria}</div>
              <div className="table-cell">R$ {produto.preco}</div>
              <div className="table-cell">{produto.quantidade}</div>
              <div className="table-cell">
                <span className={`status-badge status-${produto.status}`}>
                  {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="table-cell table-cell-actions">
                <LoadingButton 
                  className="btn-editar" 
                  onClick={() => {
                    setEditingProduto(produto)
                    setShowModal(true)
                  }}
                >
                  ✏️ Editar
                </LoadingButton>
                <LoadingButton 
                  className="btn-deletar" 
                  onClick={() => handleDelete(produto.id)}
                >
                  🗑️ Excluir
                </LoadingButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatedModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingProduto(null)
        }}
      >
        <ProdutoModal
          produto={editingProduto}
          onClose={() => {
            setShowModal(false)
            setEditingProduto(null)
          }}
          onSave={() => {
            loadData()
            toast.success('✅ Produto salvo com sucesso!')
          }}
        />
      </AnimatedModal>
    </div>
  )
}

export default Produtos
```

---

## ✅ Checklist de Implementação

### Para cada componente (Produtos, Categorias, Vendas):

- [ ] Instalar dependências
- [ ] Importar toast e substituir alerts
- [ ] Adicionar SkeletonTable no loading
- [ ] Substituir botões por LoadingButton
- [ ] Usar AnimatedModal
- [ ] Adicionar motion.div nas table-rows
- [ ] Adicionar ShakeContainer em campos (opcional)
- [ ] Testar todas as funcionalidades

### Para Dashboard:

- [ ] Usar DashboardAnimated.tsx ou
- [ ] Adicionar AnimatedCounter
- [ ] Adicionar StaggerContainer
- [ ] Adicionar motion em cards
- [ ] Adicionar Pulse em alertas críticos

### Geral:

- [ ] Adicionar ToastProvider no App
- [ ] Importar Animations.css no main.jsx
- [ ] Testar em diferentes temas (light/dark)
- [ ] Verificar performance
- [ ] Testar responsividade

---

## 🎯 Resultado Esperado

Depois de aplicar todas as animações, você terá:

✅ **Loading suave** com skeletons  
✅ **Transições** entre páginas  
✅ **Feedback visual** em todas as ações  
✅ **Botões animados** com hover e press  
✅ **Modais elegantes** com fade + scale  
✅ **Linhas de tabela** com slide in  
✅ **Contadores animados** no dashboard  
✅ **Toast notifications** modernas  
✅ **Alertas pulsantes** para itens críticos  
✅ **Shake em erros** de validação  

**Interface profissional e moderna! 🚀**
