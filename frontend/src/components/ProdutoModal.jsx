import { useState, useEffect } from 'react'

function ProdutoModal({ produto, categorias, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo: '',
    preco: '',
    quantidade: 0,
    categoria_id: '',
    ativo: true
  })

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        codigo: produto.codigo || '',
        preco: produto.preco || '',
        quantidade: produto.quantidade || 0,
        categoria_id: produto.categoria_id || '',
        ativo: produto.ativo ?? true
      })
    }
  }, [produto])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Converter string vazia em null para categoria_id
    const dataToSend = {
      ...formData,
      categoria_id: formData.categoria_id === '' ? null : formData.categoria_id
    }
    
    onSave(dataToSend)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{produto ? 'Editar Produto' : 'Novo Produto'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria_id">Categoria</label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="preco">Preço *</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade *</label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '8px' }}
              />
              Ativo
            </label>
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="success">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProdutoModal
