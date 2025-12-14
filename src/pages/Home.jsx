import { useState } from 'react'
import Navbar from '../components/Navbar'
import AboutModal from '../components/AboutModal'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { language } = useLanguage()
  const [showAbout, setShowAbout] = useState(false)
  const navigate = useNavigate()

  const content = {
    en: {
      title: 'Kisan Drishti – Smart Eyes for Smarter Farming',
      subtitle: 'Empowering farmers and inspiring the next generation with tech-driven tools and insights for modern agriculture.',
      getStarted: 'GET STARTED',
      learnMore: 'LEARN MORE',
      scroll: 'SCROLL',
      presentedBy: 'presented by:',
      poweredBy: 'Powered by Infyra Innovations LLP',
      advisory: 'Advisory support only. Follow local agri officer guidance for chemical use.',
    },
    hi: {
      title: 'किसान दृष्टि – स्मार्ट खेती के लिए स्मार्ट नजरें',
      subtitle: 'आधुनिक कृषि के लिए तकनीक-संचालित उपकरणों और अंतर्दृष्टि के साथ किसानों को सशक्त बनाना और अगली पीढ़ी को प्रेरित करना।',
      getStarted: 'शुरू करें',
      learnMore: 'अधिक जानें',
      scroll: 'स्क्रॉल',
      presentedBy: 'प्रस्तुतकर्ता:',
      poweredBy: 'इन्फायरा इनोवेशंस एलएलपी द्वारा संचालित',
      advisory: 'केवल सलाहकार सहायता। रसायनों के उपयोग के लिए स्थानीय कृषि अधिकारी के मार्गदर्शन का पालन करें।',
    },
  }

  const text = content[language]

  return (
    <div className="min-h-screen bg-white">
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} language={language} />

      {/* Hero Section */}
      <div
        className="relative h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="border-b-4 border-yellow-400 inline-block pb-2">{text.title.split('–')[0]}</span>
            <br className="hidden sm:block" />
            <span className="sm:ml-2">{text.title.split('–')[1]}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            {text.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/chatbot')}
              className="bg-kisan-green hover:bg-kisan-dark-green text-white px-8 py-3 rounded-full font-semibold text-base sm:text-lg transition-colors shadow-lg w-full sm:w-auto"
            >
              {text.getStarted}
            </button>
            <button
              onClick={() => navigate('/simulation')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-base sm:text-lg transition-colors shadow-lg w-full sm:w-auto"
            >
              {text.learnMore}
            </button>
          </div>

        </div>

        {/* Scroll Indicator - outside content div for proper alignment */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block z-10">
          <div className="flex flex-col items-center text-white">
            <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2 mb-2">
              <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm">{text.scroll}</span>
          </div>
        </div>

        {/* Logo in bottom right */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 hidden lg:block">
          <div className="text-white text-xs mb-2">{text.presentedBy}</div>
          <div className="bg-white/95 rounded-lg px-4 py-3 shadow-lg">
            <Logo size="default" showText={true} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-kisan-dark-green font-medium mb-2">{text.poweredBy}</p>
          <p className="text-xs sm:text-sm text-gray-600">{text.advisory}</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

