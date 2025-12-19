import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Categorias from './components/Categorias'
import Produtos from './components/Produtos'
import Vendas from './components/Vendas'
import { AnimatedPage } from './components/AnimationComponents'
import { ToastProvider } from './components/ToastProvider'
import './styles/AppLayout.css'
import './styles/Animations.css'

type TabType = 'dashboard' | 'categorias' | 'produtos' | 'vendas'
type ThemeType = 'light' | 'dark' | 'system'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme')
    return (savedTheme as ThemeType) || 'system'
  })

  useEffect(() => {
    const applyTheme = (themeValue: ThemeType) => {
      if (themeValue === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      } else {
        document.documentElement.setAttribute('data-theme', themeValue)
      }
    }

    applyTheme(theme)

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

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AnimatedPage key="dashboard">
            <Dashboard />
          </AnimatedPage>
        )
      case 'categorias':
        return (
          <AnimatedPage key="categorias">
            <Categorias />
          </AnimatedPage>
        )
      case 'produtos':
        return (
          <AnimatedPage key="produtos">
            <Produtos />
          </AnimatedPage>
        )
      case 'vendas':
        return (
          <AnimatedPage key="vendas">
            <Vendas />
          </AnimatedPage>
        )
      default:
        return (
          <AnimatedPage key="dashboard">
            <Dashboard />
          </AnimatedPage>
        )
    }
  }

  return (
    <div className="app-layout">
      <ToastProvider />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
