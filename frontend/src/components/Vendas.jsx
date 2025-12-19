import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { getVendas, createVenda, updateVenda, deleteVenda, getProdutos } from '../services/api'
import VendaModal from './VendaModal'
import '../styles/Vendas.css'

function Vendas() {
  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [buscaCliente, setBuscaCliente] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingVenda, setEditingVenda] = useState(null)
  const [displayCount, setDisplayCount] = useState(20)
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [bulkEditData, setBulkEditData] = useState({ status: '' })
  const observerTarget = useRef(null)

  useEffect(() => {
    loadData()
  }, [filtro])

  const loadData = async () => {
    try {
      setLoading(true)
      setIsRetrying(false)
      const [vendasRes, produtosRes] = await Promise.all([
        getVendas(filtro),
        getProdutos(1, '', 1000) // Buscar até 1000 produtos
      ])
      
      setVendas(vendasRes.data)
      
      // Tratar resposta paginada ou array simples
      if (produtosRes.data.data) {
        setProdutos(produtosRes.data.data)
      } else {
        setProdutos(produtosRes.data)
      }
      
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados')
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
    if (selectedIds.length === vendasExibidas.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(vendasExibidas.map(v => v.id))
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
      setError('Selecione ao menos uma venda')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkAction(action)
    setShowBulkModal(true)
  }

  const handleBulkEdit = () => {
    if (selectedIds.length === 0) {
      setError('Selecione ao menos uma venda')
      setTimeout(() => setError(null), 3000)
      return
    }
    setBulkEditData({ status: '' })
    setShowBulkEditModal(true)
  }

  const executeBulkEdit = async () => {
    try {
      setLoading(true)
      const selectedVendas = vendas.filter(v => selectedIds.includes(v.id))
      
      await Promise.all(selectedVendas.map(v => 
        updateVenda(v.id, {
          produto_id: v.produto_id,
          cliente: v.cliente,
          quantidade: v.quantidade,
          valorUnitario: v.valorUnitario,
          data: v.data,
          status: bulkEditData.status || v.status
        })
      ))
      
      setSuccess(`${selectedIds.length} venda(s) atualizada(s) com sucesso!`)
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
      const selectedVendas = vendas.filter(v => selectedIds.includes(v.id))
      
      if (bulkAction === 'delete') {
        await Promise.all(selectedVendas.map(v => deleteVenda(v.id)))
        setSuccess(`${selectedIds.length} venda(s) excluída(s) com sucesso!`)
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

  const handleCreate = () => {
    setEditingVenda(null)
    setShowModal(true)
  }

  const handleEdit = (venda) => {
    setEditingVenda(venda)
    setShowModal(true)
  }

  const handleSave = async (data) => {
    try {
      if (editingVenda) {
        await updateVenda(editingVenda.id, data)
        setSuccess('Venda atualizada com sucesso!')
      } else {
        await createVenda(data)
        setSuccess('Venda criada com sucesso!')
      }
      setShowModal(false)
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err.response?.data)
      
      // Montar mensagem de erro detalhada
      let errorMessage = 'Erro ao salvar venda'
      
      if (err.response?.data?.errors) {
        // Erros de validação do Laravel (422)
        const errors = err.response.data.errors
        const errorList = Object.entries(errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join('; ')
        errorMessage = `Erro de validação: ${errorList}`
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`
      }
      
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) {
      return
    }

    try {
      await deleteVenda(id)
      setSuccess('Venda excluída com sucesso!')
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao excluir venda: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(null), 5000)
    }
  }

  const vendasFiltradas = useMemo(() => {
    return vendas.filter(venda => {
      // Filtro por status
      if (filtro !== 'todas' && venda.status !== filtro) {
        return false
      }

      // Filtro por nome do cliente
      if (buscaCliente && !venda.cliente.toLowerCase().includes(buscaCliente.toLowerCase())) {
        return false
      }

      // Filtro por data de início
      if (dataInicio) {
        const vendaData = new Date(venda.data)
        const dataInicioObj = new Date(dataInicio)
        if (vendaData < dataInicioObj) {
          return false
        }
      }

      // Filtro por data fim
      if (dataFim) {
        const vendaData = new Date(venda.data)
        const dataFimObj = new Date(dataFim)
        if (vendaData > dataFimObj) {
          return false
        }
      }

      return true
    })
  }, [vendas, filtro, buscaCliente, dataInicio, dataFim])

  const vendasExibidas = useMemo(() => {
    return vendasFiltradas.slice(0, displayCount)
  }, [vendasFiltradas, displayCount])

  const totalVendas = vendasFiltradas.reduce((sum, venda) => sum + venda.valorTotal, 0)
  const hasMore = displayCount < vendasFiltradas.length

  const limparFiltros = () => {
    setFiltro('todas')
    setBuscaCliente('')
    setDataInicio('')
    setDataFim('')
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

  // Reset displayCount quando filtros mudam
  useEffect(() => {
    setDisplayCount(20)
  }, [filtro, buscaCliente, dataInicio, dataFim])

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluida': return 'status-concluida'
      case 'pendente': return 'status-pendente'
      case 'cancelada': return 'status-cancelada'
      default: return ''
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'concluida': return 'Concluída'
      case 'pendente': return 'Pendente'
      case 'cancelada': return 'Cancelada'
      default: return status
    }
  }

  if (loading && !isRetrying) {
    return (
      <div className="vendas">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando vendas...</div>
        </div>
      </div>
    )
  }

  // Tela de erro com opção de retry
  if (error && vendas.length === 0 && !loading) {
    return (
      <div className="vendas">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Erro ao carregar vendas</h2>
          <p className="error-message">{error}</p>
          <button className="btn-retry" onClick={handleRetry}>
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="vendas">
      <div className="vendas-header">
        <div>
          <h1>Vendas</h1>
          <p className="vendas-subtitle">Gerencie todas as vendas do sistema</p>
        </div>
        <button className="btn-nova-venda" onClick={handleCreate}>
          <span>➕</span> Nova Venda
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
              ✏️ Alterar Status
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

      <div className="vendas-resumo">
        <div className="resumo-card">
          <span className="resumo-icon">📊</span>
          <div>
            <p className="resumo-label">Total de Vendas</p>
            <p className="resumo-value">{vendasFiltradas.length}</p>
          </div>
        </div>
        <div className="resumo-card">
          <span className="resumo-icon">💰</span>
          <div>
            <p className="resumo-label">Valor Total</p>
            <p className="resumo-value">R$ {totalVendas.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {vendasFiltradas.length > 0 && (
        <div className="vendas-info-filtro">
          <span className="info-filtro-text">
            Mostrando <strong>{vendasExibidas.length}</strong> de <strong>{vendasFiltradas.length}</strong> vendas
            {vendasFiltradas.length !== vendas.length && ` (${vendas.length} total)`}
          </span>
        </div>
      )}

      <div className="vendas-filtros">
        <div className="filtros-status">
          <button
            className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas
          </button>
          <button
            className={`filtro-btn ${filtro === 'concluida' ? 'active' : ''}`}
            onClick={() => setFiltro('concluida')}
          >
            Concluídas
          </button>
          <button
            className={`filtro-btn ${filtro === 'pendente' ? 'active' : ''}`}
            onClick={() => setFiltro('pendente')}
          >
            Pendentes
          </button>
          <button
            className={`filtro-btn ${filtro === 'cancelada' ? 'active' : ''}`}
            onClick={() => setFiltro('cancelada')}
          >
            Canceladas
          </button>
        </div>

        <div className="filtros-busca">
          <div className="filtro-input-group">
            <label htmlFor="busca-cliente">🔍 Cliente</label>
            <input
              id="busca-cliente"
              type="text"
              className="filtro-input"
              placeholder="Buscar por nome do cliente..."
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
            />
          </div>

          <div className="filtro-input-group">
            <label htmlFor="data-inicio">📅 Data Início</label>
            <input
              id="data-inicio"
              type="date"
              className="filtro-input"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="filtro-input-group">
            <label htmlFor="data-fim">📅 Data Fim</label>
            <input
              id="data-fim"
              type="date"
              className="filtro-input"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          {(buscaCliente || dataInicio || dataFim) && (
            <button className="btn-limpar-filtros" onClick={limparFiltros}>
              🗑️ Limpar Filtros
            </button>
          )}
        </div>
      </div>

      <div className="vendas-lista">
        {vendasFiltradas.length === 0 ? (
          <div className="vendas-empty">
            <span className="empty-icon">📦</span>
            <p>Nenhuma venda encontrada</p>
          </div>
        ) : (
          <div className="vendas-table">
            <div className="table-header">
              <div className="checkbox-cell">
                <input
                  type="checkbox"
                  className="checkbox-select-all"
                  checked={selectedIds.length === vendasExibidas.length && vendasExibidas.length > 0}
                  onChange={toggleSelectAll}
                />
              </div>
              <div>ID</div>
              <div>Produto</div>
              <div>Cliente</div>
              <div>Quantidade</div>
              <div>Valor Unit.</div>
              <div>Total</div>
              <div>Data</div>
              <div>Status</div>
              <div>Ações</div>
            </div>
            {vendasExibidas.map((venda) => (
              <div key={venda.id} className={`table-row ${selectedIds.includes(venda.id) ? 'selected' : ''}`}>
                <div className="checkbox-cell">
                  <input
                    type="checkbox"
                    className="checkbox-item"
                    checked={selectedIds.includes(venda.id)}
                    onChange={() => toggleSelectItem(venda.id)}
                  />
                </div>
                <div className="table-cell">#{venda.id}</div>
                <div className="table-cell">
                  <strong>{venda.produto}</strong>
                  <small>{venda.categoria}</small>
                </div>
                <div className="table-cell">{venda.cliente}</div>
                <div className="table-cell">{venda.quantidade}</div>
                <div className="table-cell">R$ {venda.valorUnitario.toFixed(2)}</div>
                <div className="table-cell valor-total">R$ {venda.valorTotal.toFixed(2)}</div>
                <div className="table-cell">{new Date(venda.data).toLocaleDateString('pt-BR')}</div>
                <div className="table-cell">
                  <span className={`status-badge ${getStatusClass(venda.status)}`}>
                    {getStatusLabel(venda.status)}
                  </span>
                </div>
                <div className="table-cell table-cell-actions">
                  <button className="btn-editar" onClick={() => handleEdit(venda)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-deletar" onClick={() => handleDelete(venda.id)}>
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
          <span>Carregando mais vendas...</span>
        </div>
      )}

      {!loading && !hasMore && vendasExibidas.length > 0 && vendasExibidas.length === vendasFiltradas.length && (
        <div className="scroll-end">
          <span>✓ Todas as vendas foram carregadas</span>
        </div>
      )}

      {/* Modal de Edição em Massa */}
      {showBulkEditModal && (
        <div className="modal-overlay" onClick={() => setShowBulkEditModal(false)}>
          <div className="modal-content bulk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Status em Massa</h2>
              <button className="modal-close" onClick={() => setShowBulkEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="bulk-edit-info">
                <span className="info-icon">ℹ️</span>
                <p>Você está editando <strong>{selectedIds.length}</strong> venda(s)</p>
                <p className="info-text">O status será alterado para todas as vendas selecionadas</p>
              </div>

              <div className="bulk-edit-form">
                <div className="form-row">
                  <label htmlFor="bulk-status">Novo Status</label>
                  <select
                    id="bulk-status"
                    className="bulk-input"
                    value={bulkEditData.status}
                    onChange={(e) => setBulkEditData({ status: e.target.value })}
                  >
                    <option value="">-- Selecione o Status --</option>
                    <option value="concluida">Concluída</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="bulk-preview">
                <h3>📋 Vendas Selecionadas</h3>
                <div className="bulk-items-list">
                  {vendas.filter(v => selectedIds.includes(v.id)).map(venda => (
                    <div key={venda.id} className="bulk-item">
                      <span className="bulk-item-id">#{venda.id}</span>
                      <span className="bulk-item-name">{venda.cliente}</span>
                      <span className="bulk-item-desc">
                        {venda.produto} - {getStatusLabel(venda.status)}
                        {bulkEditData.status && ` → ${getStatusLabel(bulkEditData.status)}`}
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
              <button 
                className="btn-confirm-edit" 
                onClick={executeBulkEdit}
                disabled={!bulkEditData.status}
              >
                ✓ Confirmar Edição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão em Massa */}
      {showBulkModal && bulkAction === 'delete' && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-content bulk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Excluir em Massa</h2>
              <button className="modal-close" onClick={() => setShowBulkModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="bulk-warning">
                <span className="warning-icon">⚠️</span>
                <p>Você está prestes a excluir <strong>{selectedIds.length}</strong> venda(s)</p>
                <p className="warning-text">Esta ação não pode ser desfeita!</p>
              </div>

              <div className="bulk-preview">
                <h3>📋 Vendas a serem excluídas</h3>
                <div className="bulk-items-list">
                  {vendas.filter(v => selectedIds.includes(v.id)).map(venda => (
                    <div key={venda.id} className="bulk-item">
                      <span className="bulk-item-id">#{venda.id}</span>
                      <span className="bulk-item-name">{venda.cliente}</span>
                      <span className="bulk-item-desc">
                        {venda.produto} - R$ {venda.valorTotal.toFixed(2)}
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
                ✓ Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <VendaModal
          venda={editingVenda}
          produtos={produtos}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Vendas
