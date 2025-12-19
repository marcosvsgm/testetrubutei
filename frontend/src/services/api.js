import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Categorias
export const getCategorias = (page = 1, search = '', perPage = 500) => {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (search) params.append('search', search)
  if (perPage) params.append('per_page', perPage)
  return api.get(`/categorias?${params.toString()}`)
}
export const getCategoria = (id) => api.get(`/categorias/${id}`)
export const createCategoria = (data) => api.post('/categorias', data)
export const updateCategoria = (id, data) => api.put(`/categorias/${id}`, data)
export const deleteCategoria = (id) => api.delete(`/categorias/${id}`)

// Produtos
export const getProdutos = (page = 1, search = '', perPage = 500) => {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (search) params.append('search', search)
  if (perPage) params.append('per_page', perPage)
  return api.get(`/produtos?${params.toString()}`)
}
export const getProduto = (id) => api.get(`/produtos/${id}`)
export const createProduto = (data) => api.post('/produtos', data)
export const updateProduto = (id, data) => api.put(`/produtos/${id}`, data)
export const deleteProduto = (id) => api.delete(`/produtos/${id}`)

// Dashboard
export const getDashboard = () => api.get('/dashboard')

// Vendas
export const getVendas = (status = 'todas') => api.get(`/vendas?status=${status}`)
export const getVenda = (id) => api.get(`/vendas/${id}`)
export const createVenda = (data) => api.post('/vendas', data)
export const updateVenda = (id, data) => api.put(`/vendas/${id}`, data)
export const deleteVenda = (id) => api.delete(`/vendas/${id}`)

export default api
