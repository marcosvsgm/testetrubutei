import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'
import '../styles/Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalCategorias: 0,
    vendasHoje: 0,
    valorTotalHoje: 0
  })
  const [ultimasAtividades, setUltimasAtividades] = useState([])
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await getDashboard()
      const data = response.data
      
      setStats(data.stats || {
        totalProdutos: 0,
        totalCategorias: 0,
        vendasHoje: 0,
        valorTotalHoje: 0
      })
      
      setUltimasAtividades(data.ultimasAtividades || [])
      setProdutosMaisVendidos(data.produtosMaisVendidos || [])
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: '📦',
      color: '#3498db',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Categorias',
      value: stats.totalCategorias,
      icon: '📁',
      color: '#9b59b6',
      bgColor: '#f3e5f5'
    },
    {
      title: 'Vendas Hoje',
      value: stats.vendasHoje,
      icon: '💰',
      color: '#27ae60',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Valor Total',
      value: `R$ ${(stats.valorTotalHoje || 0).toFixed(2)}`,
      icon: '💵',
      color: '#e67e22',
      bgColor: '#fff3e0'
    }
  ]

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Visão geral do sistema de estoque</p>
      </div>

      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card" style={{ borderLeftColor: card.color }}>
            <div className="card-icon" style={{ backgroundColor: card.bgColor }}>
              <span style={{ fontSize: '2.5rem' }}>{card.icon}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-value" style={{ color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Últimas Atividades</h3>
          <div className="activity-list">
            {ultimasAtividades.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                Nenhuma atividade recente
              </p>
            ) : (
              ultimasAtividades.map((atividade, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{atividade.icon}</span>
                  <div className="activity-content">
                    <p className="activity-title">{atividade.title}</p>
                    <p className="activity-time">{atividade.time}</p>
                  </div>
                  {atividade.valor && (
                    <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                      R$ {atividade.valor.toFixed(2)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>Produtos Mais Vendidos</h3>
          <div className="product-list">
            {produtosMaisVendidos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                Nenhum produto vendido ainda
              </p>
            ) : (
              produtosMaisVendidos.map((produto, index) => (
                <div key={index} className="product-item">
                  <span className="product-rank">{index + 1}</span>
                  <div className="product-info">
                    <p className="product-name">{produto.name}</p>
                    <div 
                      className="product-bar" 
                      style={{ width: `${produto.percentage}%` }}
                    ></div>
                  </div>
                  <span className="product-sales">{produto.sales}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
