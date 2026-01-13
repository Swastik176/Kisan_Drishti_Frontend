import { useState } from 'react'
import Navbar from '../components/Navbar'
import AboutModal from '../components/AboutModal'
import axios from 'axios'
import API_ENDPOINTS from '../config/api'
import { useLanguage } from '../context/LanguageContext'
import Select from 'react-select'

const Simulation = () => {
  const { language } = useLanguage()
  const [showAbout, setShowAbout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const cropOptions = [
      { value: 'wheat', label: language === 'hi' ? 'गेहूं (Wheat)' : 'Wheat' },
      { value: 'rice', label: language === 'hi' ? 'चावल (Rice)' : 'Rice' },
      { value: 'maize', label: language === 'hi' ? 'मक्का (Maize)' : 'Maize' },
      { value: 'barley', label: language === 'hi' ? 'जौ (Barley)' : 'Barley' },
      { value: 'sorghum', label: language === 'hi' ? 'ज्वार (Sorghum)' : 'Sorghum (Jowar)' },
      { value: 'pearl_millet', label: language === 'hi' ? 'बाजरा (Pearl Millet)' : 'Pearl Millet (Bajra)' },
      { value: 'finger_millet', label: language === 'hi' ? 'रागी (Finger Millet)' : 'Finger Millet (Ragi)' },

      { value: 'chickpea', label: language === 'hi' ? 'चना (Chickpea)' : 'Chickpea (Gram)' },
      { value: 'pigeon_pea', label: language === 'hi' ? 'अरहर (Pigeon Pea)' : 'Pigeon Pea (Arhar)' },
      { value: 'green_gram', label: language === 'hi' ? 'मूंग (Green Gram)' : 'Green Gram (Moong)' },
      { value: 'black_gram', label: language === 'hi' ? 'उड़द (Black Gram)' : 'Black Gram (Urad)' },
      { value: 'lentil', label: language === 'hi' ? 'मसूर (Lentil)' : 'Lentil (Masoor)' },

      { value: 'mustard', label: language === 'hi' ? 'सरसों (Mustard)' : 'Mustard' },
      { value: 'groundnut', label: language === 'hi' ? 'मूंगफली (Groundnut)' : 'Groundnut (Peanut)' },
      { value: 'soybean', label: language === 'hi' ? 'सोयाबीन (Soybean)' : 'Soybean' },

      { value: 'sugarcane', label: language === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane' },
      { value: 'cotton', label: language === 'hi' ? 'कपास (Cotton)' : 'Cotton' },

      { value: 'potato', label: language === 'hi' ? 'आलू (Potato)' : 'Potato' },
      { value: 'tomato', label: language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato' },
      { value: 'onion', label: language === 'hi' ? 'प्याज (Onion)' : 'Onion' },

      { value: 'mango', label: language === 'hi' ? 'आम (Mango)' : 'Mango' },
      { value: 'banana', label: language === 'hi' ? 'केला (Banana)' : 'Banana' },

      { value: 'tea', label: language === 'hi' ? 'चाय (Tea)' : 'Tea' },
      { value: 'coffee', label: language === 'hi' ? 'कॉफी (Coffee)' : 'Coffee' },
    ]

    const [crop, setCrop] = useState(
    cropOptions.find((c) => c.value === 'wheat')
    )


  // Define simulation parameters matching backend API (13 parameters)
  const [parameters, setParameters] = useState([
    {
      id: 'soil_moisture',
      name: { en: 'Soil Moisture (%)', hi: 'मिट्टी की नमी (%)' },
      value: 18,
      min: 0,
      max: 100,
      unit: '%',
    },
    {
      id: 'soil_temperature',
      name: { en: 'Soil Temperature (°C)', hi: 'मिट्टी का तापमान (°C)' },
      value: 26,
      min: 10,
      max: 50,
      unit: '°C',
    },
    {
      id: 'air_temperature',
      name: { en: 'Air Temperature (°C)', hi: 'हवा का तापमान (°C)' },
      value: 38,
      min: 10,
      max: 50,
      unit: '°C',
    },
    {
      id: 'humidity',
      name: { en: 'Humidity (%)', hi: 'आर्द्रता (%)' },
      value: 30,
      min: 0,
      max: 100,
      unit: '%',
    },
    {
      id: 'rainfall',
      name: { en: 'Rainfall (mm)', hi: 'वर्षा (mm)' },
      value: 0,
      min: 0,
      max: 2000,
      unit: 'mm',
    },
    {
      id: 'soil_ph',
      name: { en: 'Soil pH', hi: 'मिट्टी का pH' },
      value: 8.1,
      min: 4.0,
      max: 9.0,
      unit: '',
    },
    {
      id: 'ec',
      name: { en: 'Electrical Conductivity (dS/m)', hi: 'विद्युत चालकता (dS/m)' },
      value: 1.8,
      min: 0,
      max: 5.0,
      unit: 'dS/m',
    },
    {
      id: 'nitrogen',
      name: { en: 'Nitrogen (kg/ha)', hi: 'नाइट्रोजन (kg/ha)' },
      value: 9,
      min: 0,
      max: 200,
      unit: 'kg/ha',
    },
    {
      id: 'phosphorus',
      name: { en: 'Phosphorus (kg/ha)', hi: 'फॉस्फोरस (kg/ha)' },
      value: 7,
      min: 0,
      max: 100,
      unit: 'kg/ha',
    },
    {
      id: 'potassium',
      name: { en: 'Potassium (kg/ha)', hi: 'पोटेशियम (kg/ha)' },
      value: 80,
      min: 0,
      max: 150,
      unit: 'kg/ha',
    },
    {
      id: 'leaf_wetness',
      name: { en: 'Leaf Wetness', hi: 'पत्ती की नमी' },
      value: 0.8,
      min: 0,
      max: 1,
      unit: '',
    },
    {
      id: 'ndvi',
      name: { en: 'NDVI (Normalized Difference Vegetation Index)', hi: 'NDVI (सामान्यीकृत वनस्पति सूचकांक)' },
      value: 0.3,
      min: 0,
      max: 1,
      unit: '',
    },
    {
      id: 'plant_color_index',
      name: { en: 'Plant Color Index', hi: 'पौधे का रंग सूचकांक' },
      value: 25,
      min: 0,
      max: 100,
      unit: '',
    },
  ])

  const content = {
    en: {
      title: 'Crop Simulation',
      subtitle: 'Adjust the parameters below and submit to get recommendations',
      parameter: 'Parameter',
      value: 'Value',
      range: 'Range',
      submit: 'Submit',
      reset: 'Reset',
      result: 'Simulation Result',
      mlPrediction: 'ML Prediction',
      condition: 'Condition',
      confidence: 'Confidence',
      problems: 'Problems Detected',
      advice: 'AI Recommendations',
      explanation: 'Explanation',
      poweredBy: 'Powered by Infyra Innovations LLP',
      advisory: 'Advisory support only. Follow local agri officer guidance for chemical use.',
    },
    hi: {
      title: 'फसल सिमुलेशन',
      subtitle: 'नीचे दिए गए पैरामीटर समायोजित करें और सिफारिशें प्राप्त करने के लिए सबमिट करें',
      parameter: 'पैरामीटर',
      value: 'मान',
      range: 'सीमा',
      submit: 'सबमिट करें',
      reset: 'रीसेट',
      result: 'सिमुलेशन परिणाम',
      mlPrediction: 'ML भविष्यवाणी',
      condition: 'स्थिति',
      confidence: 'विश्वास',
      problems: 'पाई गई समस्याएं',
      advice: 'AI सिफारिशें',
      explanation: 'व्याख्या',
      poweredBy: 'इन्फायरा इनोवेशंस एलएलपी द्वारा संचालित',
      advisory: 'केवल सलाहकार सहायता। रसायनों के उपयोग के लिए स्थानीय कृषि अधिकारी के मार्गदर्शन का पालन करें।',
    },
  }

  const text = content[language]

  const handleParameterChange = (id, newValue) => {
    setParameters((prev) =>
      prev.map((param) => {
        if (param.id === id) {
          const numValue = parseFloat(newValue)
          // Validate range
          if (!isNaN(numValue) && numValue >= param.min && numValue <= param.max) {
            return { ...param, value: numValue }
          }
          // Allow intermediate invalid states while typing
          if (newValue === '' || newValue === '-') {
            return { ...param, value: newValue }
          }
        }
        return param
      })
    )
    setError(null)
    setResult(null)
  }

  const handleReset = () => {
    setCrop('wheat')
    setParameters([
      {
        id: 'soil_moisture',
        name: { en: 'Soil Moisture (%)', hi: 'मिट्टी की नमी (%)' },
        value: 18,
        min: 0,
        max: 100,
        unit: '%',
      },
      {
        id: 'soil_temperature',
        name: { en: 'Soil Temperature (°C)', hi: 'मिट्टी का तापमान (°C)' },
        value: 26,
        min: 10,
        max: 50,
        unit: '°C',
      },
      {
        id: 'air_temperature',
        name: { en: 'Air Temperature (°C)', hi: 'हवा का तापमान (°C)' },
        value: 38,
        min: 10,
        max: 50,
        unit: '°C',
      },
      {
        id: 'humidity',
        name: { en: 'Humidity (%)', hi: 'आर्द्रता (%)' },
        value: 30,
        min: 0,
        max: 100,
        unit: '%',
      },
      {
        id: 'rainfall',
        name: { en: 'Rainfall (mm)', hi: 'वर्षा (mm)' },
        value: 0,
        min: 0,
        max: 2000,
        unit: 'mm',
      },
      {
        id: 'soil_ph',
        name: { en: 'Soil pH', hi: 'मिट्टी का pH' },
        value: 8.1,
        min: 4.0,
        max: 9.0,
        unit: '',
      },
      {
        id: 'ec',
        name: { en: 'Electrical Conductivity (dS/m)', hi: 'विद्युत चालकता (dS/m)' },
        value: 1.8,
        min: 0,
        max: 5.0,
        unit: 'dS/m',
      },
      {
        id: 'nitrogen',
        name: { en: 'Nitrogen (kg/ha)', hi: 'नाइट्रोजन (kg/ha)' },
        value: 9,
        min: 0,
        max: 200,
        unit: 'kg/ha',
      },
      {
        id: 'phosphorus',
        name: { en: 'Phosphorus (kg/ha)', hi: 'फॉस्फोरस (kg/ha)' },
        value: 7,
        min: 0,
        max: 100,
        unit: 'kg/ha',
      },
      {
        id: 'potassium',
        name: { en: 'Potassium (kg/ha)', hi: 'पोटेशियम (kg/ha)' },
        value: 80,
        min: 0,
        max: 150,
        unit: 'kg/ha',
      },
      {
        id: 'leaf_wetness',
        name: { en: 'Leaf Wetness', hi: 'पत्ती की नमी' },
        value: 0.8,
        min: 0,
        max: 1,
        unit: '',
      },
      {
        id: 'ndvi',
        name: { en: 'NDVI (Normalized Difference Vegetation Index)', hi: 'NDVI (सामान्यीकृत वनस्पति सूचकांक)' },
        value: 0.3,
        min: 0,
        max: 1,
        unit: '',
      },
      {
        id: 'plant_color_index',
        name: { en: 'Plant Color Index', hi: 'पौधे का रंग सूचकांक' },
        value: 25,
        min: 0,
        max: 100,
        unit: '',
      },
    ])
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    // Validate all parameters
    const invalidParams = parameters.filter((param) => {
      const value = typeof param.value === 'number' ? param.value : parseFloat(param.value)
      return isNaN(value) || value < param.min || value > param.max
    })

    if (invalidParams.length > 0) {
      setError(language === 'hi' ? 'कृपया सभी पैरामीटर वैध सीमा के भीतर होने सुनिश्चित करें' : 'Please ensure all parameters are within valid ranges')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Prepare data for submission - backend expects flat object with parameter names as keys
      const data = {
      crop: crop.value, // 👈 NEW FIELD
      ...parameters.reduce((acc, param) => {
        acc[param.id] =
          typeof param.value === 'number'
            ? param.value
            : parseFloat(param.value)
        return acc
      }, {}),
    }

    const response = await axios.post(API_ENDPOINTS.SIMULATION, data)

      setResult(response.data)
    } catch (err) {
      console.error('Error submitting simulation:', err)
      setError(
        language === 'hi'
          ? 'त्रुटि: सिमुलेशन प्रस्तुत करने में विफल। कृपया पुनः प्रयास करें।'
          : 'Error: Failed to submit simulation. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} language={language} />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-kisan-dark-green mb-2">{text.title}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{text.subtitle}</p>

          {/* Crop Selection */}
            <div className="mb-6">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {language === 'hi' ? 'फसल का चयन करें' : 'Select Crop'}
              </label>

              <Select
                options={cropOptions}
                value={crop}
                onChange={(selected) => setCrop(selected)}
                isSearchable
                placeholder={language === 'hi' ? 'फसल खोजें...' : 'Search crop...'}
                className="sm:w-96"
                classNamePrefix="react-select"
              />
          </div>


          {/* Parameters Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-kisan-green text-white">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold">
                      {text.parameter}
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold">
                      {text.range}
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold">
                      {text.value}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium text-gray-900">
                        {param.name[language]}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-gray-600">
                        {param.min} - {param.max} {param.unit}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <input
                          type="number"
                          min={param.min}
                          max={param.max}
                          step={['soil_ph', 'ec', 'leaf_wetness', 'ndvi'].includes(param.id) ? 0.1 : 1}
                          value={param.value}
                          onChange={(e) => handleParameterChange(param.id, e.target.value)}
                          className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisan-green focus:border-transparent text-sm sm:text-base"
                          aria-label={`${param.name[language]} input`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-kisan-green hover:bg-kisan-dark-green text-white rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (language === 'hi' ? 'प्रसंस्करण...' : 'Processing...') : text.submit}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {text.reset}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mb-6 space-y-4">
              {/* ML Prediction Section */}
              {result.local_ml_prediction && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4">{text.mlPrediction}</h2>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="font-semibold text-gray-700">{text.condition}:</span>
                        <span className="ml-2 text-blue-800 font-medium capitalize">
                          {result.local_ml_prediction.predicted_condition || result.local_ml_prediction.predicted_class}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">{text.confidence}:</span>
                        <span className="ml-2 text-blue-800 font-medium">
                          {(result.local_ml_prediction.confidence * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    {result.local_ml_prediction.message && (
                      <p className="text-gray-800 mt-2 p-3 bg-white rounded border border-blue-100">
                        {result.local_ml_prediction.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* LLM Explanation Section */}
              {result.local_llm_explanation && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-kisan-dark-green mb-4">AI Analysis</h2>
                  <div className="space-y-4 text-sm sm:text-base">
                    {/* Problems Detected */}
                    {result.local_llm_explanation.problems_detected && result.local_llm_explanation.problems_detected.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-red-700 mb-2">{text.problems}:</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {result.local_llm_explanation.problems_detected.map((problem, index) => (
                            <li key={index} className="text-gray-800">{problem}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Advice */}
                    {result.local_llm_explanation.ai_advice && result.local_llm_explanation.ai_advice.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-kisan-dark-green mb-2">{text.advice}:</h3>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {result.local_llm_explanation.ai_advice.map((advice, index) => (
                            <li key={index} className="text-gray-800">{advice}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Explanation */}
                    {result.local_llm_explanation.explanation && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{text.explanation}:</h3>
                        <p className="text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border border-green-100">
                          {result.local_llm_explanation.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback for unknown response format */}
              {!result.local_ml_prediction && !result.local_llm_explanation && (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-kisan-dark-green mb-4">{text.result}</h2>
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-white p-4 rounded border">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
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

export default Simulation