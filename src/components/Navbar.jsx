import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Logo from './Logo'

const Navbar = ({ showAbout, setShowAbout }) => {
  const { language, setLanguage } = useLanguage()
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/chatbot', label: 'Chatbot' },
    { path: '/simulation', label: 'Simulation' },
  ]

  return (
    <nav className="bg-kisan-dark-green text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <Logo size="small" showText={false} variant="white" />
            <span className="text-lg sm:text-xl font-semibold">
              Kisan Drishti - AI Krishi Mitra
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isActive(item.path)
                    ? 'bg-white text-kisan-dark-green font-medium'
                    : 'hover:bg-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Language and Info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-white/10 rounded-full p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  language === 'en'
                    ? 'bg-white text-kisan-dark-green font-medium'
                    : 'hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  language === 'hi'
                    ? 'bg-white text-kisan-dark-green font-medium'
                    : 'hover:bg-white/20'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Info Button */}
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="About"
            >
              <span className="text-lg font-bold">i</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-white text-kisan-dark-green font-medium'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

