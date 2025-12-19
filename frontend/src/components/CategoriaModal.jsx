import { useState, useEffect } from 'react'

function CategoriaModal({ categoria, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativo: true
  })

  useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome || '',
        descricao: categoria.descricao || '',
        ativo: categoria.ativo ?? true
      })
    }
  }, [categoria])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{categoria ? 'Editar Categoria' : 'Nova Categoria'}</h2>
        
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
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
            />
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

export default CategoriaModal
