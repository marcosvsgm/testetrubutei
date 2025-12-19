import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/api'
import CategoriaModal from './CategoriaModal'
import '../styles/Categorias.css'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const [search, setSearch] = useState('')
  const [displayCount, setDisplayCount] = useState(20)
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [bulkEditData, setBulkEditData] = useState({ descricao: '' })
  const observerTarget = useRef(null)

  useEffect(() => {
    loadCategorias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCategorias = async () => {
    try {
      setLoading(true)
      setIsRetrying(false)
      
      const response = await getCategorias(1, '', 1000) // Buscar até 1000 categorias
      
      // Tratar resposta paginada ou array simples
      if (response.data.data) {
        setCategorias(response.data.data)
      } else {
        setCategorias(response.data)
      }
      
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      setError('Erro ao carregar categorias: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    loadCategorias()
  }

  // Funções de seleção em massa
  const toggleSelectAll = () => {
    if (selectedIds.length === categoriasExibidas.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(categoriasExibidas.map(cat => cat.id))
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
      setError('Selecione ao menos uma categoria')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkAction(action)
    setShowBulkModal(true)
  }

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) {
      setError('Selecione ao menos uma categoria')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkEditData({ descricao: '' })
    setShowBulkEditModal(true)
  }

  const executeBulkEdit = async () => {
    try {
      setLoading(true)
      
      const selectedCategorias = categorias.filter(cat => selectedIds.includes(cat.id))
      
      // Atualizar descrição de todas as categorias selecionadas
      await Promise.all(selectedCategorias.map(cat => 
        updateCategoria(cat.id, {
          nome: cat.nome,
          descricao: bulkEditData.descricao
        })
      ))
      
      setSuccess(`${selectedIds.length} categoria(s) atualizada(s) com sucesso!`)
      setShowBulkEditModal(false)
      setSelectedIds([])
      loadCategorias()
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
      
      const selectedCategorias = categorias.filter(cat => selectedIds.includes(cat.id))
      
      if (bulkAction === 'delete') {
        // Deletar categorias selecionadas
        await Promise.all(selectedCategorias.map(cat => deleteCategoria(cat.id)))
        setSuccess(`${selectedIds.length} categoria(s) excluída(s) com sucesso!`)
      }
      
      setShowBulkModal(false)
      setSelectedIds([])
      loadCategorias()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao executar ação em massa: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(categoria => {
      if (search && !categoria.nome.toLowerCase().includes(search.toLowerCase()) &&
          !categoria.descricao?.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      return true
    })
  }, [categorias, search])

  const categoriasExibidas = useMemo(() => {
    return categoriasFiltradas.slice(0, displayCount)
  }, [categoriasFiltradas, displayCount])

  const hasMore = displayCount < categoriasFiltradas.length

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
    setEditingCategoria(null)
    setShowModal(true)
  }

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria)
    setShowModal(true)
  }

  const handleSave = async (data) => {
    try {
      if (editingCategoria) {
        await updateCategoria(editingCategoria.id, data)
        setSuccess('Categoria atualizada com sucesso!')
      } else {
        await createCategoria(data)
        setSuccess('Categoria criada com sucesso!')
      }
      setShowModal(false)
      loadCategorias()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar categoria: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      await deleteCategoria(id)
      setSuccess('Categoria excluída com sucesso!')
      loadCategorias()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao excluir categoria: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    }
  }

  if (loading && !isRetrying) {
    return (
      <div className="categorias">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando categorias...</div>
        </div>
      </div>
    )
  }

  // Tela de erro com opção de retry
  if (error && categorias.length === 0 && !loading) {
    return (
      <div className="categorias">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Erro ao carregar categorias</h2>
          <p className="error-message">{error}</p>
          <button className="btn-retry" onClick={handleRetry}>
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="categorias">
      <div className="categorias-header">
        <div>
          <h1>Categorias</h1>
          <p className="categorias-subtitle">Organize seus produtos por categorias</p>
        </div>
        <button className="btn-nova-categoria" onClick={handleCreate}>
          + Nova Categoria
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
              ✏️ Editar Descrição
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
      <div className="categorias-search">
        <div className="search-form">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou descrição..."
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
      {categoriasFiltradas.length > 0 && (
        <div className="categorias-info">
          <span className="info-text">
            Mostrando <strong>{categoriasExibidas.length}</strong> de <strong>{categoriasFiltradas.length}</strong> categorias
            {categoriasFiltradas.length !== categorias.length && ` (${categorias.length} total)`}
          </span>
        </div>
      )}

      <div className="categorias-lista">
        {categoriasFiltradas.length === 0 ? (
          <div className="categorias-empty">
            <span className="empty-icon">📁</span>
            <h3>Nenhuma categoria encontrada</h3>
            <p>Crie categorias para organizar seus produtos</p>
          </div>
        ) : (
          <div className="categorias-table">
            <div className="table-header">
              <div className="checkbox-cell">
                <input
                  type="checkbox"
                  className="checkbox-select-all"
                  checked={selectedIds.length === categoriasExibidas.length && categoriasExibidas.length > 0}
                  onChange={toggleSelectAll}
                />
              </div>
              <div>ID</div>
              <div>Nome</div>
              <div>Descrição</div>
              <div>Ações</div>
            </div>
            {categoriasExibidas.map((categoria) => (
              <div key={categoria.id} className={`table-row ${selectedIds.includes(categoria.id) ? 'selected' : ''}`}>
                <div className="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    className="checkbox-item"
                    checked={selectedIds.includes(categoria.id)}
                    onChange={() => toggleSelectItem(categoria.id)}
                  />
                </div>
                <div className="table-cell">#{categoria.id}</div>
                <div className="table-cell"><strong>{categoria.nome}</strong></div>
                <div className="table-cell">{categoria.descricao || '-'}</div>
                <div className="table-cell table-cell-actions">
                  <button className="btn-editar" onClick={() => handleEdit(categoria)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-deletar" onClick={() => handleDelete(categoria.id)}>
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
          <span>Carregando mais categorias...</span>
        </div>
      )}

      {!loading && !hasMore && categoriasExibidas.length > 0 && categoriasExibidas.length === categoriasFiltradas.length && (
        <div className="scroll-end">
          <span>✓ Todas as categorias foram carregadas</span>
        </div>
      )}

      {showModal && (
        <CategoriaModal
          categoria={editingCategoria}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de Edição em Massa */}
      {showBulkEditModal && (
        <div className="modal-overlay" onClick={() => setShowBulkEditModal(false)}>
          <div className="modal-content bulk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Categorias em Massa</h2>
              <button className="modal-close" onClick={() => setShowBulkEditModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="bulk-edit-info">
                <span className="info-icon">✏️</span>
                <p>Você está editando <strong>{selectedIds.length}</strong> categoria(s).</p>
                <p className="info-text">A descrição será atualizada para todas as categorias selecionadas.</p>
              </div>

              <div className="bulk-edit-form">
                <label htmlFor="bulk-descricao">Nova Descrição:</label>
                <textarea
                  id="bulk-descricao"
                  className="bulk-textarea"
                  rows="4"
                  placeholder="Digite a nova descrição para todas as categorias selecionadas..."
                  value={bulkEditData.descricao}
                  onChange={(e) => setBulkEditData({ descricao: e.target.value })}
                />
              </div>

              <div className="bulk-preview">
                <h3>Categorias que serão atualizadas:</h3>
                <div className="bulk-items-list">
                  {categorias.filter(cat => selectedIds.includes(cat.id)).map(categoria => (
                    <div key={categoria.id} className="bulk-item">
                      <span className="bulk-item-id">#{categoria.id}</span>
                      <span className="bulk-item-name">{categoria.nome}</span>
                      <span className="bulk-item-desc-old">
                        De: {categoria.descricao || 'Sem descrição'}
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
                <p>Você está prestes a excluir <strong>{selectedIds.length}</strong> categoria(s).</p>
                <p className="warning-text">Esta ação não pode ser desfeita!</p>
              </div>

              <div className="bulk-preview">
                <h3>Categorias Selecionadas:</h3>
                <div className="bulk-items-list">
                  {categorias.filter(cat => selectedIds.includes(cat.id)).map(categoria => (
                    <div key={categoria.id} className="bulk-item">
                      <span className="bulk-item-id">#{categoria.id}</span>
                      <span className="bulk-item-name">{categoria.nome}</span>
                      <span className="bulk-item-desc">{categoria.descricao || 'Sem descrição'}</span>
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

export default Categorias
