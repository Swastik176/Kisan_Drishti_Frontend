import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  // Default to English and load from localStorage if available
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('kisan-drishti-language')
    return saved || 'en'
  })

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('kisan-drishti-language', language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

