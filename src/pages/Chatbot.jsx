import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AboutModal from '../components/AboutModal'
import axios from 'axios'
import API_ENDPOINTS from '../config/api'
import { useLanguage } from '../context/LanguageContext'

const Chatbot = () => {
  const { language } = useLanguage()
  const [showAbout, setShowAbout] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const content = {
    en: {
      greeting: 'Namaste!',
      intro: 'I am Kisan Drishti — your AI Krishi Mitra. Ask about crops, upload photos, or get advice on soil and weather.',
      placeholder: 'Ask about crop, disease, soil, weather...',
      send: 'Send',
      poweredBy: 'Powered by Infyra Innovations LLP',
      advisory: 'Advisory support only. Follow local agri officer guidance for chemical use.',
    },
    hi: {
      greeting: 'नमस्ते !',
      intro: 'मैं किसान दृष्टि हूं - आपका AI कृषि मित्र। फसल पूछिए, फोटो अपलोड कीजिए, या मिट्टी और मौसम की सलाह लीजिए।',
      placeholder: 'फसल, रोग, मिट्टी, मौसम के बारे में पूछें...',
      send: 'भेजें',
      poweredBy: 'इन्फायरा इनोवेशंस एलएलपी द्वारा संचालित',
      advisory: 'केवल सलाहकार सहायता। रसायनों के उपयोग के लिए स्थानीय कृषि अधिकारी के मार्गदर्शन का पालन करें।',
    },
  }

  const text = content[language]

  const handleSend = async () => {
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_ENDPOINTS.CHATBOT}?Content-Type=application/json`,
        {
          query: userMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      // Handle the new response structure with answer, intent, confidence, source_id
      const answer = response.data.answer || response.data.response || 'No response received.'
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: language === 'hi' ? 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Sorry, an error occurred. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    alert(language === 'hi' ? 'आवाज इनपुट जल्द ही उपलब्ध होगा' : 'Voice input will be available soon')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} language={language} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Logo Icon */}
        <div className="mb-6 sm:mb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-kisan-green rounded-full flex items-center justify-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-kisan-dark-green rounded-full"></div>
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-kisan-dark-green mb-4 sm:mb-6">
          {text.greeting}
        </h1>

        {/* Intro Text */}
        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center mb-8 sm:mb-12 max-w-2xl px-4">
          {text.intro}
        </p>

        {/* Messages Area */}
        {messages.length > 0 && (
          <div className="w-full max-w-3xl mb-6 max-h-96 overflow-y-auto px-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-kisan-green text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="w-full max-w-3xl px-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-3 sm:py-4 shadow-lg">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={text.placeholder}
              className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-800 placeholder-gray-500"
              disabled={loading}
            />
            <button
              onClick={handleVoiceInput}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              aria-label="Voice input"
              disabled={loading}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-kisan-green hover:bg-kisan-dark-green disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Send"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 sm:py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-kisan-dark-green font-medium mb-2">{text.poweredBy}</p>
          <p className="text-xs sm:text-sm text-gray-600">{text.advisory}</p>
        </div>
      </footer>
    </div>
  )
}

export default Chatbot

