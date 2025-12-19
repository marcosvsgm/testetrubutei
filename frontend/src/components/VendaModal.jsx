import { useState, useEffect } from 'react'

function VendaModal({ venda, produtos, onSave, onClose }) {
  const [formData, setFormData] = useState({
    produto_id: '',
    cliente: '',
    quantidade: 1,
    status: 'pendente'
  })

  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (venda) {
      setFormData({
        produto_id: venda.produto_id || '',
        cliente: venda.cliente || '',
        quantidade: venda.quantidade || 1,
        status: venda.status || 'pendente'
      })
    }
  }, [venda])

  useEffect(() => {
    if (formData.produto_id) {
      const produto = produtos.find(p => p.id === parseInt(formData.produto_id))
      setProdutoSelecionado(produto)
    } else {
      setProdutoSelecionado(null)
    }
  }, [formData.produto_id, produtos])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.produto_id) {
      newErrors.produto_id = 'Selecione um produto'
    }

    if (!formData.cliente || formData.cliente.trim() === '') {
      newErrors.cliente = 'Cliente é obrigatório'
    }

    if (!formData.quantidade || formData.quantidade < 1) {
      newErrors.quantidade = 'Quantidade deve ser maior que 0'
    }

    if (produtoSelecionado && formData.quantidade > produtoSelecionado.quantidade) {
      newErrors.quantidade = `Estoque insuficiente (disponível: ${produtoSelecionado.quantidade})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      // Adicionar valor_unitario ao enviar e garantir tipos corretos
      const dataToSend = {
        produto_id: parseInt(formData.produto_id),
        cliente: formData.cliente.trim(),
        quantidade: parseInt(formData.quantidade),
        valor_unitario: produtoSelecionado ? parseFloat(produtoSelecionado.preco) : 0,
        status: formData.status
      }
      onSave(dataToSend)
    }
  }

  const calcularTotal = () => {
    if (produtoSelecionado && formData.quantidade) {
      return (parseFloat(produtoSelecionado.preco) * parseInt(formData.quantidade)).toFixed(2)
    }
    return '0.00'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{venda ? 'Editar Venda' : 'Nova Venda'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="produto_id">
              Produto <span className="required">*</span>
            </label>
            <select
              id="produto_id"
              name="produto_id"
              value={formData.produto_id}
              onChange={handleChange}
              className={errors.produto_id ? 'error' : ''}
              disabled={!!venda}
            >
              <option value="">Selecione um produto</option>
              {produtos
                .filter(p => p.ativo && p.quantidade > 0)
                .map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {parseFloat(produto.preco).toFixed(2)} (Estoque: {produto.quantidade})
                  </option>
                ))}
            </select>
            {errors.produto_id && <span className="error-message">{errors.produto_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cliente">
              Cliente <span className="required">*</span>
            </label>
            <input
              type="text"
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className={errors.cliente ? 'error' : ''}
              placeholder="Nome do cliente"
            />
            {errors.cliente && <span className="error-message">{errors.cliente}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">
              Quantidade <span className="required">*</span>
            </label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              className={errors.quantidade ? 'error' : ''}
              min="1"
              max={produtoSelecionado ? produtoSelecionado.quantidade : undefined}
            />
            {errors.quantidade && <span className="error-message">{errors.quantidade}</span>}
            {produtoSelecionado && (
              <small className="form-hint">
                Disponível em estoque: {produtoSelecionado.quantidade} unidades
              </small>
            )}
          </div>

          {produtoSelecionado && (
            <div className="form-group">
              <label>Valor Total</label>
              <div className="total-display">
                R$ {calcularTotal()}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {venda ? 'Atualizar' : 'Criar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VendaModal
