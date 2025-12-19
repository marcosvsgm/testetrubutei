import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Categorias from './components/Categorias'
import Produtos from './components/Produtos'
import Vendas from './components/Vendas'
import './styles/AppLayout.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [theme, setTheme] = useState(() => {
    // Recupera o tema salvo ou usa 'system' como padrão
    return localStorage.getItem('theme') || 'system'
  })

  useEffect(() => {
    const applyTheme = (themeValue) => {
      if (themeValue === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      } else {
        document.documentElement.setAttribute('data-theme', themeValue)
      }
    }

    // Aplica o tema inicial
    applyTheme(theme)

    // Listener para mudanças no tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'categorias':
        return <Categorias />
      case 'produtos':
        return <Produtos />
      case 'vendas':
        return <Vendas />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
