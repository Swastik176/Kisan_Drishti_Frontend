import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import Simulation from './pages/Simulation'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/simulation" element={<Simulation />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App

