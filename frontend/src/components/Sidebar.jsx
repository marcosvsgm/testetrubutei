import { useState, useEffect } from 'react'
import '../styles/Sidebar.css'

function Sidebar({ activeTab, setActiveTab, theme, onThemeChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'categorias', label: 'Categorias', icon: '📁' },
    { id: 'produtos', label: 'Produtos', icon: '📦' },
    { id: 'vendas', label: 'Vendas', icon: '💰' }
  ]

  const adminProfile = {
    nome: 'Administrador',
    email: 'admin@estoquepro.com',
    role: 'Administrador',
    avatar: '👤'
  }

  // Detectar clique fora da sidebar no mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileOpen && !e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen])

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId)
    setIsMobileOpen(false) // Fechar sidebar no mobile após clicar
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    onThemeChange(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '💻'
      default:
        return '💻'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Modo Claro'
      case 'dark':
        return 'Modo Escuro'
      case 'system':
        return 'Sistema'
      default:
        return 'Sistema'
    }
  }

  return (
    <>
      {/* Botão hamburguer para mobile */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay para mobile */}
      {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🏪</span>
          {!isCollapsed && <h2 className="sidebar-title">Estoque Pro</h2>}
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expandir' : 'Recolher'}
        >
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-item">
              <a
                href="#"
                className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleMenuClick(item.id)
                }}
                title={item.label}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>

        {/* Botão de Tema */}
        <div className="theme-toggle-container">
          <button 
            className="theme-toggle-button"
            onClick={cycleTheme}
            title={getThemeLabel()}
          >
            <span className="theme-icon">{getThemeIcon()}</span>
            {!isCollapsed && <span className="theme-label">{getThemeLabel()}</span>}
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => setShowProfile(!showProfile)}>
          <span className="sidebar-icon">{adminProfile.avatar}</span>
          {!isCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{adminProfile.nome}</span>
              <span className="sidebar-user-role">{adminProfile.role}</span>
            </div>
          )}
          {!isCollapsed && (
            <span className="sidebar-user-arrow">{showProfile ? '▲' : '▼'}</span>
          )}
        </div>

        {/* Dropdown do perfil */}
        {showProfile && !isCollapsed && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <div className="profile-avatar">{adminProfile.avatar}</div>
              <div className="profile-info">
                <strong>{adminProfile.nome}</strong>
                <span>{adminProfile.email}</span>
              </div>
            </div>
            <div className="profile-menu">
              <button className="profile-menu-item">
                <span>⚙️</span> Configurações
              </button>
              <button className="profile-menu-item">
                <span>👤</span> Meu Perfil
              </button>
              <button className="profile-menu-item">
                <span>🔔</span> Notificações
              </button>
              <hr />
              <button className="profile-menu-item logout">
                <span>🚪</span> Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}

export default Sidebar
