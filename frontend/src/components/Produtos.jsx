import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { getProdutos, createProduto, updateProduto, deleteProduto, getCategorias } from '../services/api'
import ProdutoModal from './ProdutoModal'
import '../styles/Produtos.css'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [search, setSearch] = useState('')
  const [displayCount, setDisplayCount] = useState(20)
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [bulkEditData, setBulkEditData] = useState({ preco: '', quantidade: '' })
  const observerTarget = useRef(null)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setIsRetrying(false)
      
      const [produtosRes, categoriasRes] = await Promise.all([
        getProdutos(1, '', 1000), // Buscar até 1000 produtos
        getCategorias(1, '', 1000) // Buscar até 1000 categorias
      ])
      
      // Tratar resposta paginada ou array simples
      if (produtosRes.data.data) {
        setProdutos(produtosRes.data.data)
      } else {
        setProdutos(produtosRes.data)
      }

      if (categoriasRes.data.data) {
        setCategorias(categoriasRes.data.data)
      } else {
        setCategorias(categoriasRes.data)
      }
      
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    loadData()
  }

  // Funções de seleção em massa
  const toggleSelectAll = () => {
    if (selectedIds.length === produtosExibidos.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(produtosExibidos.map(prod => prod.id))
    }
  }

  const toggleSelectItem = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      setError('Selecione ao menos um produto')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkAction(action)
    setShowBulkModal(true)
  }

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) {
      setError('Selecione ao menos um produto')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkEditData({ preco: '', quantidade: '' })
    setShowBulkEditModal(true)
  }

  const executeBulkEdit = async () => {
    try {
      setLoading(true)
      
      const selectedProdutos = produtos.filter(prod => selectedIds.includes(prod.id))
      
      // Atualizar preço e/ou quantidade dos produtos selecionados
      await Promise.all(selectedProdutos.map(prod => 
        updateProduto(prod.id, {
          nome: prod.nome,
          codigo: prod.codigo,
          descricao: prod.descricao,
          categoria_id: prod.categoria_id,
          preco: bulkEditData.preco || prod.preco,
          quantidade: bulkEditData.quantidade || prod.quantidade,
          ativo: prod.ativo
        })
      ))
      
      setSuccess(`${selectedIds.length} produto(s) atualizado(s) com sucesso!`)
      setShowBulkEditModal(false)
      setSelectedIds([])
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao editar em massa: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const executeBulkAction = async () => {
    try {
      setLoading(true)
      
      const selectedProdutos = produtos.filter(prod => selectedIds.includes(prod.id))
      
      if (bulkAction === 'delete') {
        await Promise.all(selectedProdutos.map(prod => deleteProduto(prod.id)))
        setSuccess(`${selectedIds.length} produto(s) excluído(s) com sucesso!`)
      }
      
      setShowBulkModal(false)
      setSelectedIds([])
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao executar ação em massa: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(produto => {
      if (search && !produto.nome.toLowerCase().includes(search.toLowerCase()) &&
          !produto.codigo?.toLowerCase().includes(search.toLowerCase()) &&
          !produto.descricao?.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      return true
    })
  }, [produtos, search])

  const produtosExibidos = useMemo(() => {
    return produtosFiltrados.slice(0, displayCount)
  }, [produtosFiltrados, displayCount])

  const hasMore = displayCount < produtosFiltrados.length

  const limparBusca = () => {
    setSearch('')
    setDisplayCount(20)
  }

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setDisplayCount(prev => prev + 20)
    }
  }, [hasMore, loading])

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '500px' // Carrega quando estiver 500px antes do final
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadMore])

  // Reset displayCount quando busca muda
  useEffect(() => {
    setDisplayCount(20)
  }, [search])

  const handleCreate = () => {
    setEditingProduto(null)
    setShowModal(true)
  }

  const handleEdit = (produto) => {
    setEditingProduto(produto)
    setShowModal(true)
  }

  const handleSave = async (data) => {
    try {
      if (editingProduto) {
        await updateProduto(editingProduto.id, data)
        setSuccess('Produto atualizado com sucesso!')
      } else {
        await createProduto(data)
        setSuccess('Produto criado com sucesso!')
      }
      setShowModal(false)
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar produto: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      await deleteProduto(id)
      setSuccess('Produto excluído com sucesso!')
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao excluir produto: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    }
  }

  const getCategoriaNome = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId)
    return categoria ? categoria.nome : '-'
  }

  if (loading && !isRetrying) {
    return (
      <div className="produtos">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando produtos...</div>
        </div>
      </div>
    )
  }

  // Tela de erro com opção de retry
  if (error && produtos.length === 0 && !loading) {
    return (
      <div className="produtos">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Erro ao carregar produtos</h2>
          <p className="error-message">{error}</p>
          <button className="btn-retry" onClick={handleRetry}>
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="produtos">
      <div className="produtos-header">
        <div>
          <h1>Produtos</h1>
          <p className="produtos-subtitle">Gerencie o catálogo de produtos do estoque</p>
        </div>
        <button className="btn-novo-produto" onClick={handleCreate}>
          + Novo Produto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Barra de Ações em Massa */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedIds.length} item(ns) selecionado(s)</span>
          </div>
          <div className="bulk-buttons">
            <button className="btn-bulk-edit" onClick={handleBulkEdit}>
              ✏️ Editar Preço/Qtd
            </button>
            <button className="btn-bulk-delete" onClick={() => handleBulkAction('delete')}>
              🗑️ Excluir Selecionados
            </button>
            <button className="btn-bulk-cancel" onClick={() => setSelectedIds([])}>
              ✕ Cancelar Seleção
            </button>
          </div>
        </div>
      )}

      {/* Barra de busca */}
      <div className="produtos-search">
        <div className="search-form">
          <input
            type="text"
            placeholder="🔍 Buscar por nome, código ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button type="button" className="btn-limpar" onClick={limparBusca}>
              🗑️ Limpar
            </button>
          )}
        </div>
      </div>

      {/* Informações de exibição */}
      {produtosFiltrados.length > 0 && (
        <div className="produtos-info">
          <span className="info-text">
            Mostrando <strong>{produtosExibidos.length}</strong> de <strong>{produtosFiltrados.length}</strong> produtos
            {produtosFiltrados.length !== produtos.length && ` (${produtos.length} total)`}
          </span>
        </div>
      )}

      <div className="produtos-lista">
        {produtosFiltrados.length === 0 ? (
          <div className="produtos-empty">
            <span className="empty-icon">📦</span>
            <h3>Nenhum produto encontrado</h3>
            <p>Adicione novos produtos ao seu estoque</p>
          </div>
        ) : (
          <div className="produtos-table">
            <div className="table-header">
              <div className="checkbox-cell">
                <input
                  type="checkbox"
                  className="checkbox-select-all"
                  checked={selectedIds.length === produtosExibidos.length && produtosExibidos.length > 0}
                  onChange={toggleSelectAll}
                />
              </div>
              <div>ID</div>
              <div>Código</div>
              <div>Nome</div>
              <div>Categoria</div>
              <div>Preço</div>
              <div>Qtd</div>
              <div>Status</div>
              <div>Ações</div>
            </div>
            {produtosExibidos.map((produto) => (
              <div key={produto.id} className={`table-row ${selectedIds.includes(produto.id) ? 'selected' : ''}`}>
                <div className="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    className="checkbox-item"
                    checked={selectedIds.includes(produto.id)}
                    onChange={() => toggleSelectItem(produto.id)}
                  />
                </div>
                <div className="table-cell">#{produto.id}</div>
                <div className="table-cell">{produto.codigo || '-'}</div>
                <div className="table-cell"><strong>{produto.nome}</strong></div>
                <div className="table-cell">{getCategoriaNome(produto.categoria_id)}</div>
                <div className="table-cell">R$ {parseFloat(produto.preco).toFixed(2)}</div>
                <div className="table-cell">{produto.quantidade}</div>
                <div className="table-cell">
                  <span className={`status-badge ${produto.ativo ? 'status-ativo' : 'status-inativo'}`}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="table-cell table-cell-actions">
                  <button className="btn-editar" onClick={() => handleEdit(produto)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-deletar" onClick={() => handleDelete(produto.id)}>
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll infinito - elemento observador */}
      {!loading && hasMore && (
        <div ref={observerTarget} className="scroll-loading">
          <div className="loading-spinner-small"></div>
          <span>Carregando mais produtos...</span>
        </div>
      )}

      {!loading && !hasMore && produtosExibidos.length > 0 && produtosExibidos.length === produtosFiltrados.length && (
        <div className="scroll-end">
          <span>✓ Todos os produtos foram carregados</span>
        </div>
      )}

      {showModal && (
        <ProdutoModal
          produto={editingProduto}
          categorias={categorias}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de Edição em Massa */}
      {showBulkEditModal && (
        <div className="modal-overlay" onClick={() => setShowBulkEditModal(false)}>
          <div className="modal-content bulk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Produtos em Massa</h2>
              <button className="modal-close" onClick={() => setShowBulkEditModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="bulk-edit-info">
                <span className="info-icon">✏️</span>
                <p>Você está editando <strong>{selectedIds.length}</strong> produto(s).</p>
                <p className="info-text">Deixe o campo vazio para manter o valor original.</p>
              </div>

              <div className="bulk-edit-form">
                <div className="form-row">
                  <label htmlFor="bulk-preco">Novo Preço (R$):</label>
                  <input
                    id="bulk-preco"
                    type="number"
                    step="0.01"
                    min="0"
                    className="bulk-input"
                    placeholder="Ex: 99.90"
                    value={bulkEditData.preco}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, preco: e.target.value }))}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="bulk-quantidade">Nova Quantidade:</label>
                  <input
                    id="bulk-quantidade"
                    type="number"
                    min="0"
                    className="bulk-input"
                    placeholder="Ex: 100"
                    value={bulkEditData.quantidade}
                    onChange={(e) => setBulkEditData(prev => ({ ...prev, quantidade: e.target.value }))}
                  />
                </div>
              </div>

              <div className="bulk-preview">
                <h3>Produtos que serão atualizados:</h3>
                <div className="bulk-items-list">
                  {produtos.filter(prod => selectedIds.includes(prod.id)).map(produto => (
                    <div key={produto.id} className="bulk-item">
                      <span className="bulk-item-id">#{produto.id}</span>
                      <span className="bulk-item-name">{produto.nome}</span>
                      <span className="bulk-item-desc-old">
                        Atual: R$ {parseFloat(produto.preco).toFixed(2)} / Qtd: {produto.quantidade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBulkEditModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm-edit" onClick={executeBulkEdit}>
                Confirmar Edição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão em Massa */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-content bulk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Exclusão em Massa</h2>
              <button className="modal-close" onClick={() => setShowBulkModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="bulk-warning">
                <span className="warning-icon">⚠️</span>
                <p>Você está prestes a excluir <strong>{selectedIds.length}</strong> produto(s).</p>
                <p className="warning-text">Esta ação não pode ser desfeita!</p>
              </div>

              <div className="bulk-preview">
                <h3>Produtos Selecionados:</h3>
                <div className="bulk-items-list">
                  {produtos.filter(prod => selectedIds.includes(prod.id)).map(produto => (
                    <div key={produto.id} className="bulk-item">
                      <span className="bulk-item-id">#{produto.id}</span>
                      <span className="bulk-item-name">{produto.nome}</span>
                      <span className="bulk-item-desc">
                        R$ {parseFloat(produto.preco).toFixed(2)} - Qtd: {produto.quantidade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBulkModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={executeBulkAction}>
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produtos
