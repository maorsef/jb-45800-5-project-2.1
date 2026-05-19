import './Navbar.css'

import {
  NavLink
} from 'react-router-dom'

import {
  FaBitcoin,
  FaMoon,
  FaSun
} from 'react-icons/fa'

import {
  useEffect,
  useState
} from 'react'

function Navbar() {
  const [darkMode, setDarkMode] =
    useState(true)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove(
        'light-mode'
      )
    } else {
      document.body.classList.add(
        'light-mode'
      )
    }
  }, [darkMode])

  return (
    <header className='navbar'>
      <div className='navbar-container'>
        <div className='logo'>
          <FaBitcoin />

          <span>CryptoPulse</span>
        </div>

        <nav className='nav-links'>
          <NavLink to='/'>
            Home
          </NavLink>

          <NavLink to='/live-reports'>
            Live Reports
          </NavLink>

          <NavLink to='/ai-recommendations'>
            AI Recommendations
          </NavLink>

          <NavLink to='/about'>
            About
          </NavLink>

          <button
            className='theme-btn'
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar