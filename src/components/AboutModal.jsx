const AboutModal = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null

  const content = {
    en: {
      title: 'About Kisan Drishti',
      description1: 'Kisan Drishti™ is an AI & IoT Driven Precision Agriculture Platform developed by Infyra Innovations LLP.',
      description2: 'Our mission is to empower farmers with intelligent, data-driven insights for better crop management, disease detection, and sustainable farming practices.',
      features: 'Features:',
      featureList: [
        'AI-powered crop advisory',
        'Real-time plant disease detection',
        'Weather-based recommendations',
        'Soil health monitoring',
        'Irrigation optimization',
        'Multilingual support (English & Hindi)',
      ],
      contact: 'For more information, contact Infyra Innovations LLP.',
    },
    hi: {
      title: 'किसान दृष्टि के बारे में',
      description1: 'किसान दृष्टि™ इन्फायरा इनोवेशंस एलएलपी द्वारा विकसित एक AI और IoT संचालित सटीक कृषि प्लेटफॉर्म है।',
      description2: 'हमारा मिशन बेहतर फसल प्रबंधन, रोग का पता लगाने और सतत कृषि प्रथाओं के लिए किसानों को बुद्धिमान, डेटा-संचालित अंतर्दृष्टि के साथ सशक्त बनाना है।',
      features: 'विशेषताएं:',
      featureList: [
        'AI-संचालित फसल सलाह',
        'वास्तविक समय में पौधे के रोग का पता लगाना',
        'मौसम-आधारित सिफारिशें',
        'मिट्टी स्वास्थ्य निगरानी',
        'सिंचाई अनुकूलन',
        'बहुभाषी समर्थन (अंग्रेजी और हिंदी)',
      ],
      contact: 'अधिक जानकारी के लिए, इन्फायरा इनोवेशंस एलएलपी से संपर्क करें।',
    },
  }

  const text = content[language]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-kisan-dark-green">{text.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-base sm:text-lg leading-relaxed">{text.description1}</p>
          <p className="text-base sm:text-lg leading-relaxed">{text.description2}</p>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3 text-kisan-dark-green">{text.features}</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              {text.featureList.map((feature, index) => (
                <li key={index} className="text-base sm:text-lg">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-base sm:text-lg mt-6 pt-4 border-t border-gray-200">{text.contact}</p>
        </div>
      </div>
    </div>
  )
}

export default AboutModal

