import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AboutModal from '../components/AboutModal'
import axios from 'axios'
import API_ENDPOINTS from '../config/api'
import { useLanguage } from '../context/LanguageContext'

const formatList = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'Not provided'
  }

  return items.join(', ')
}

const buildAssistantMessage = (data, language) => {
  if (data?.answer) {
    if (typeof data.answer === 'string') {
      return data.answer
    }

    if (typeof data.answer === 'object') {
      return data.answer.answer || data.answer.response || JSON.stringify(data.answer, null, 2)
    }
  }

  if (data?.disease || data?.crop) {
    const labels = language === 'hi'
      ? {
          crop: 'फसल',
          disease: 'रोग',
          symptoms: 'लक्षण',
          causes: 'कारण',
          solution: 'उपाय',
        }
      : {
          crop: 'Crop',
          disease: 'Disease',
          symptoms: 'Symptoms',
          causes: 'Causes',
          solution: 'Solution',
        }

    return [
      `${labels.crop}: ${data.crop || 'Unknown'}`,
      `${labels.disease}: ${data.disease || 'Unknown'}`,
      `${labels.symptoms}: ${formatList(data.symptoms)}`,
      `${labels.causes}: ${formatList(data.causes)}`,
      `${labels.solution}: ${formatList(data.solution)}`,
    ].join('\n')
  }

  return language === 'hi' ? 'कोई उत्तर प्राप्त नहीं हुआ।' : 'No response received.'
}

const Chatbot = () => {
  const { language } = useLanguage()
  const [showAbout, setShowAbout] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const content = {
    en: {
      greeting: 'Namaste!',
      intro: 'I am Kisan Drishti, your AI Krishi Mitra. Ask agriculture questions or attach a crop image for disease analysis.',
      placeholder: 'Ask about crop, disease, soil, weather...',
      poweredBy: 'Powered by Infyra Innovations LLP',
      advisory: 'Advisory support only. Follow local agri officer guidance for chemical use.',
      attach: 'Attach image',
      removeImage: 'Remove',
      imageReady: 'Image attached',
      uploadHint: 'Attach a crop image and ask a question like "What disease is this?"',
      voiceSoon: 'Voice input will be available soon',
      error: 'Sorry, an error occurred. Please try again.',
      missingQuery: 'Please enter a question before sending.',
      sending: 'Analyzing...',
    },
    hi: {
      greeting: 'नमस्ते!',
      intro: 'मैं किसान दृष्टि हूँ, आपका AI कृषि मित्र। खेती से जुड़े सवाल पूछें या रोग पहचान के लिए फसल की फोटो जोड़ें।',
      placeholder: 'फसल, रोग, मिट्टी, मौसम के बारे में पूछें...',
      poweredBy: 'इन्फायरा इनोवेशंस एलएलपी द्वारा संचालित',
      advisory: 'केवल सलाहकार सहायता। रसायनों के उपयोग के लिए स्थानीय कृषि अधिकारी के मार्गदर्शन का पालन करें।',
      attach: 'चित्र जोड़ें',
      removeImage: 'हटाएं',
      imageReady: 'चित्र जुड़ गया',
      uploadHint: 'फसल की फोटो जोड़ें और पूछें "यह कौन सा रोग है?"',
      voiceSoon: 'आवाज इनपुट जल्द ही उपलब्ध होगा',
      error: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      missingQuery: 'भेजने से पहले कृपया प्रश्न लिखें।',
      sending: 'विश्लेषण हो रहा है...',
    },
  }

  const text = content[language]

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedImage(file)
  }

  const clearSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    const userMessage = message.trim()

    if (!userMessage || loading) {
      if (!userMessage && !loading) {
        setMessages((prev) => [...prev, { role: 'assistant', content: text.missingQuery }])
      }
      return
    }

    setMessage('')
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        imageName: selectedImage?.name || null,
      },
    ])
    setLoading(true)

    const imageToSend = selectedImage
    clearSelectedImage()

    try {
      const formData = new FormData()
      formData.append('query', userMessage)

      if (imageToSend) {
        formData.append('image', imageToSend)
      }

      const response = await axios.post(API_ENDPOINTS.CHATBOT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: buildAssistantMessage(response.data, language),
        },
      ])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: text.error,
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = () => {
    alert(text.voiceSoon)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} language={language} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-kisan-green rounded-full flex items-center justify-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-kisan-dark-green rounded-full"></div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-kisan-dark-green mb-4 sm:mb-6">
          {text.greeting}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center mb-8 sm:mb-12 max-w-2xl px-4">
          {text.intro}
        </p>

        {messages.length > 0 && (
          <div className="w-full max-w-3xl mb-6 max-h-96 overflow-y-auto px-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
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
                  {msg.imageName && (
                    <p className="text-xs sm:text-sm mt-2 opacity-90">Image: {msg.imageName}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600">
                  {text.sending}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="w-full max-w-3xl px-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm sm:text-base text-gray-800 transition-colors disabled:bg-gray-100"
            >
              {text.attach}
            </button>
            <p className="text-sm text-gray-600">{text.uploadHint}</p>
          </div>

          {selectedImage && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-kisan-dark-green">{text.imageReady}</p>
                <p className="text-sm text-gray-700">{selectedImage.name}</p>
              </div>
              <button
                type="button"
                onClick={clearSelectedImage}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {text.removeImage}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-3 sm:py-4 shadow-lg">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
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
                className="w-5 h-5 sm:w-6 sm:h-6 text-kisan-dark-green"
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
