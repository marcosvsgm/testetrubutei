import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  AnimatedCounter, 
  FadeIn, 
  StaggerContainer, 
  StaggerItem,
  Pulse 
} from './AnimationComponents'
import { SkeletonDashboard } from './SkeletonLoader'
import { getVendas, getProdutos, getCategorias } from '../services/api'
import '../styles/Dashboard.css'

interface DashboardStats {
  totalVendas: number
  totalProdutos: number
  totalCategorias: number
  estoqueBaixo: number
  valorTotal: number
}

function DashboardAnimated() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendas: 0,
    totalProdutos: 0,
    totalCategorias: 0,
    estoqueBaixo: 0,
    valorTotal: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [vendasRes, produtosRes, categoriasRes] = await Promise.all([
        getVendas('todas'),
        getProdutos(1, '', 1000),
        getCategorias()
      ])

      const vendas = vendasRes.data
      const produtos = produtosRes.data.data || produtosRes.data
      const categorias = categoriasRes.data

      // Calcular estatísticas
      const valorTotal = vendas.reduce((acc: number, venda: any) => acc + Number(venda.valorTotal || 0), 0)
      const estoqueBaixo = produtos.filter((p: any) => Number(p.quantidade) < 10).length

      setStats({
        totalVendas: vendas.length,
        totalProdutos: produtos.length,
        totalCategorias: categorias.length,
        estoqueBaixo,
        valorTotal
      })

      // Notificação de sucesso
      if (estoqueBaixo > 0) {
        toast.error(`⚠️ ${estoqueBaixo} produto(s) com estoque baixo!`, {
          duration: 5000
        })
      }

    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SkeletonDashboard />
  }

  if (error) {
    return (
      <motion.div 
        className="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-container">
          <motion.div 
            className="error-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            ⚠️
          </motion.div>
          <h2 className="error-title">Erro ao carregar dashboard</h2>
          <p className="error-message">{error}</p>
          <motion.button 
            className="btn-retry" 
            onClick={loadDashboardData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Tentar Novamente
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="dashboard">
      <FadeIn>
        <div className="dashboard-header">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dashboard
            </motion.h1>
            <motion.p 
              className="dashboard-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Visão geral do sistema de estoque
            </motion.p>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="dashboard-stats">
        <StaggerItem>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <p className="stat-label">Total de Vendas</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.totalVendas} />
              </p>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <p className="stat-label">Total de Produtos</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.totalProdutos} />
              </p>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div 
            className="stat-card"
            whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <p className="stat-label">Categorias</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.totalCategorias} />
              </p>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          {stats.estoqueBaixo > 0 ? (
            <Pulse>
              <motion.div 
                className="stat-card stat-card-warning"
                whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(231, 76, 60, 0.2)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <p className="stat-label">Estoque Baixo</p>
                  <p className="stat-value alert-critical">
                    <AnimatedCounter value={stats.estoqueBaixo} />
                  </p>
                </div>
              </motion.div>
            </Pulse>
          ) : (
            <motion.div 
              className="stat-card stat-card-success"
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(39, 174, 96, 0.2)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <p className="stat-label">Estoque</p>
                <p className="stat-value">OK</p>
              </div>
            </motion.div>
          )}
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.4}>
        <motion.div 
          className="dashboard-total"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="total-icon">💰</div>
          <div className="total-content">
            <p className="total-label">Valor Total em Vendas</p>
            <motion.p 
              className="total-value"
              key={stats.valorTotal}
              initial={{ scale: 1.2, color: '#27ae60' }}
              animate={{ scale: 1, color: 'var(--text-primary)' }}
              transition={{ duration: 0.3 }}
            >
              R$ {stats.valorTotal.toFixed(2)}
            </motion.p>
          </div>
        </motion.div>
      </FadeIn>
    </div>
  )
}

export default DashboardAnimated
