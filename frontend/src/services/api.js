import axios from 'axios'

// Detecta automaticamente se está em produção ou desenvolvimento
const getApiUrl = () => {
  // 1. Prioridade: variável de ambiente configurada no Railway
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 2. Se está em produção (railway.app), usa a URL do backend em produção
  if (window.location.hostname.includes('railway.app')) {
    return 'https://testetrubutei-production-6485.up.railway.app/api'
  }
  
  // 3. Desenvolvimento local
  return 'http://localhost:8000/api'
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

// Log da URL em uso (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', api.defaults.baseURL)
}

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
