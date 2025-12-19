import { useState } from 'react'
import '../styles/Navbar.css'

function Navbar({ activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">📦</span>
          <h1 className="navbar-title">Sistema de Estoque</h1>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a
              href="#"
              className={`navbar-link ${activeTab === 'categorias' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveTab('categorias')
                setMenuOpen(false)
              }}
            >
              <span className="navbar-icon">📁</span>
              Categorias
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="#"
              className={`navbar-link ${activeTab === 'produtos' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveTab('produtos')
                setMenuOpen(false)
              }}
            >
              <span className="navbar-icon">📋</span>
              Produtos
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
