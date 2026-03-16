import { useState } from 'react'
import Navbar from '../components/Navbar'
import AboutModal from '../components/AboutModal'
import axios from 'axios'
import API_ENDPOINTS from '../config/api'
import { useLanguage } from '../context/LanguageContext'
import Select from 'react-select'

const createDefaultParameters = () => ([
  {
    id: 'soil_moisture',
    name: { en: 'Soil Moisture (%)', hi: 'मिट्टी की नमी (%)' },
    value: 18,
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    id: 'soil_temperature',
    name: { en: 'Soil Temperature (deg C)', hi: 'मिट्टी का तापमान (डिग्री C)' },
    value: 26,
    min: 0,
    max: 60,
    step: 1,
    unit: 'deg C',
  },
  {
    id: 'air_temperature',
    name: { en: 'Air Temperature (deg C)', hi: 'हवा का तापमान (डिग्री C)' },
    value: 38,
    min: 0,
    max: 60,
    step: 1,
    unit: 'deg C',
  },
  {
    id: 'humidity',
    name: { en: 'Humidity (%)', hi: 'आर्द्रता (%)' },
    value: 30,
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    id: 'rainfall',
    name: { en: 'Rainfall (mm)', hi: 'वर्षा (mm)' },
    value: 0,
    min: 0,
    max: 2000,
    step: 1,
    unit: 'mm',
  },
  {
    id: 'soil_ph',
    name: { en: 'Soil pH', hi: 'मिट्टी का pH' },
    value: 8.1,
    min: 0,
    max: 14,
    step: 0.1,
    unit: '',
  },
  {
    id: 'ec',
    name: { en: 'Electrical Conductivity (dS/m)', hi: 'विद्युत चालकता (dS/m)' },
    value: 1.8,
    min: 0,
    max: 10,
    step: 0.1,
    unit: 'dS/m',
  },
  {
    id: 'nitrogen',
    name: { en: 'Nitrogen', hi: 'नाइट्रोजन' },
    value: 9,
    min: 0,
    max: 200,
    step: 1,
    unit: '',
  },
  {
    id: 'phosphorus',
    name: { en: 'Phosphorus', hi: 'फॉस्फोरस' },
    value: 7,
    min: 0,
    max: 200,
    step: 1,
    unit: '',
  },
  {
    id: 'potassium',
    name: { en: 'Potassium', hi: 'पोटैशियम' },
    value: 80,
    min: 0,
    max: 300,
    step: 1,
    unit: '',
  },
  {
    id: 'leaf_wetness',
    name: { en: 'Leaf Wetness', hi: 'पत्ती की नमी' },
    value: 0.8,
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    id: 'ndvi',
    name: { en: 'NDVI', hi: 'NDVI' },
    value: 0.3,
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    id: 'plant_color_index',
    name: { en: 'Plant Color Index', hi: 'पौधे का रंग सूचकांक' },
    value: 25,
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  {
    id: 'light_intensity',
    name: { en: 'Light Intensity', hi: 'प्रकाश तीव्रता' },
    value: 700,
    min: 0,
    max: 2000,
    step: 1,
    unit: '',
  },
  {
    id: 'co2',
    name: { en: 'CO2', hi: 'CO2' },
    value: 420,
    min: 0,
    max: 2000,
    step: 1,
    unit: 'ppm',
  },
  {
    id: 'wind_speed',
    name: { en: 'Wind Speed', hi: 'हवा की गति' },
    value: 8,
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
])

const normalizeSimulationResult = (data, fallbackCrop) => {
  if (!data || typeof data !== 'object') {
    return null
  }

  if (data.growth_status || data.issues_detected || data.recommended_actions) {
    return {
      crop: data.crop || fallbackCrop,
      growth_status: data.growth_status || 'Unknown',
      issues_detected: Array.isArray(data.issues_detected) ? data.issues_detected : [],
      recommended_actions: Array.isArray(data.recommended_actions) ? data.recommended_actions : [],
    }
  }

  const localMlPrediction = data.local_ml_prediction || {}
  const localLlmExplanation = data.local_llm_explanation || {}

  return {
    crop: data.crop || fallbackCrop,
    growth_status:
      localMlPrediction.predicted_condition ||
      localLlmExplanation.condition ||
      localMlPrediction.message ||
      'Unknown',
    issues_detected: Array.isArray(localLlmExplanation.problems_detected)
      ? localLlmExplanation.problems_detected
      : [],
    recommended_actions: Array.isArray(localLlmExplanation.ai_advice)
      ? localLlmExplanation.ai_advice
      : [],
  }
}

const Simulation = () => {
  const { language } = useLanguage()
  const [showAbout, setShowAbout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const cropOptions = [
    { value: 'wheat', label: language === 'hi' ? 'गेहूं' : 'Wheat' },
    { value: 'rice', label: language === 'hi' ? 'चावल' : 'Rice' },
    { value: 'maize', label: language === 'hi' ? 'मक्का' : 'Maize' },
    { value: 'potato', label: language === 'hi' ? 'आलू' : 'Potato' },
    { value: 'tomato', label: language === 'hi' ? 'टमाटर' : 'Tomato' },
    { value: 'onion', label: language === 'hi' ? 'प्याज' : 'Onion' },
    { value: 'banana', label: language === 'hi' ? 'केला' : 'Banana' },
    { value: 'cotton', label: language === 'hi' ? 'कपास' : 'Cotton' },
  ]

  const soilTypeOptions = [
    { value: 'sandy', label: language === 'hi' ? 'बलुई' : 'Sandy' },
    { value: 'loamy', label: language === 'hi' ? 'दोमट' : 'Loamy' },
    { value: 'clay', label: language === 'hi' ? 'चिकनी' : 'Clay' },
    { value: 'silty', label: language === 'hi' ? 'गादयुक्त' : 'Silty' },
    { value: 'black', label: language === 'hi' ? 'काली मिट्टी' : 'Black Soil' },
  ]

  const [crop, setCrop] = useState(cropOptions.find((option) => option.value === 'potato'))
  const [soilType, setSoilType] = useState(soilTypeOptions.find((option) => option.value === 'sandy'))
  const [parameters, setParameters] = useState(createDefaultParameters())

  const content = {
    en: {
      title: 'Crop Growth Prediction',
      subtitle: 'Enter live farm parameters to analyze crop growth issues and recommendations.',
      crop: 'Select Crop',
      soilType: 'Select Soil Type',
      parameter: 'Parameter',
      range: 'Range',
      value: 'Value',
      submit: 'Analyze',
      reset: 'Reset',
      result: 'Prediction Result',
      growthStatus: 'Growth status',
      issues: 'Issues detected',
      recommendations: 'Recommended actions',
      cropLabel: 'Crop analyzed',
      success: 'Prediction completed successfully.',
      processing: 'Processing...',
      validationError: 'Please ensure all parameters are within valid ranges.',
      requestError: 'Failed to fetch prediction. Please try again.',
      poweredBy: 'Powered by Infyra Innovations LLP',
      advisory: 'Advisory support only. Follow local agri officer guidance for chemical use.',
      noIssues: 'No major issues detected.',
      noRecommendations: 'No recommendations returned.',
    },
    hi: {
      title: 'फसल वृद्धि पूर्वानुमान',
      subtitle: 'खेत के पैरामीटर भरें और वृद्धि की स्थिति, समस्याएं और सुझाव देखें।',
      crop: 'फसल चुनें',
      soilType: 'मिट्टी का प्रकार चुनें',
      parameter: 'पैरामीटर',
      range: 'सीमा',
      value: 'मान',
      submit: 'विश्लेषण करें',
      reset: 'रीसेट',
      result: 'पूर्वानुमान परिणाम',
      growthStatus: 'वृद्धि स्थिति',
      issues: 'पाई गई समस्याएं',
      recommendations: 'सुझाए गए कदम',
      cropLabel: 'विश्लेषित फसल',
      success: 'पूर्वानुमान सफलतापूर्वक प्राप्त हुआ।',
      processing: 'प्रसंस्करण...',
      validationError: 'कृपया सुनिश्चित करें कि सभी पैरामीटर मान्य सीमा में हैं।',
      requestError: 'पूर्वानुमान प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।',
      poweredBy: 'इन्फायरा इनोवेशंस एलएलपी द्वारा संचालित',
      advisory: 'केवल सलाहकार सहायता। रसायनों के उपयोग के लिए स्थानीय कृषि अधिकारी के मार्गदर्शन का पालन करें।',
      noIssues: 'कोई बड़ी समस्या नहीं मिली।',
      noRecommendations: 'कोई सुझाव प्राप्त नहीं हुआ।',
    },
  }

  const text = content[language]

  const handleParameterChange = (id, newValue) => {
    setParameters((prev) =>
      prev.map((param) => {
        if (param.id !== id) {
          return param
        }

        if (newValue === '' || newValue === '-') {
          return { ...param, value: newValue }
        }

        const parsedValue = Number(newValue)

        if (!Number.isNaN(parsedValue)) {
          return { ...param, value: parsedValue }
        }

        return param
      })
    )

    setError(null)
    setResult(null)
  }

  const handleReset = () => {
    setCrop(cropOptions.find((option) => option.value === 'potato'))
    setSoilType(soilTypeOptions.find((option) => option.value === 'sandy'))
    setParameters(createDefaultParameters())
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    const invalidParams = parameters.filter((param) => {
      const value = typeof param.value === 'number' ? param.value : Number(param.value)
      return Number.isNaN(value) || value < param.min || value > param.max
    })

    if (invalidParams.length > 0) {
      setError(text.validationError)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = {
        crop: crop.value,
        soil_type: soilType.value,
        ...parameters.reduce((accumulator, param) => {
          accumulator[param.id] = typeof param.value === 'number' ? param.value : Number(param.value)
          return accumulator
        }, {}),
      }

      const response = await axios.post(API_ENDPOINTS.SENSOR_PREDICTION, payload)
      setResult(normalizeSimulationResult(response.data, crop.value))
    } catch (err) {
      console.error('Error submitting simulation:', err)
      setError(text.requestError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} language={language} />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-kisan-dark-green mb-2">{text.title}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{text.subtitle}</p>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {text.crop}
              </label>
              <Select
                options={cropOptions}
                value={crop}
                onChange={setCrop}
                isSearchable
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {text.soilType}
              </label>
              <Select
                options={soilTypeOptions}
                value={soilType}
                onChange={setSoilType}
                isSearchable
                classNamePrefix="react-select"
              />
            </div>
          </div>

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
                          step={param.step}
                          value={param.value}
                          onChange={(event) => handleParameterChange(param.id, event.target.value)}
                          className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisan-green focus:border-transparent text-sm sm:text-base"
                          aria-label={`${param.name[language]} input`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-kisan-green hover:bg-kisan-dark-green text-white rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? text.processing : text.submit}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {text.reset}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-kisan-dark-green">{text.result}</h2>
              <p className="text-sm sm:text-base text-green-900">{text.success}</p>

              <div className="grid gap-3 sm:grid-cols-2 text-sm sm:text-base">
                <div>
                  <span className="font-semibold text-gray-700">{text.cropLabel}:</span>
                  <span className="ml-2 text-gray-900 capitalize">{result.crop}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">{text.growthStatus}:</span>
                  <span className="ml-2 text-gray-900">{result.growth_status}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2">{text.issues}</h3>
                {Array.isArray(result.issues_detected) && result.issues_detected.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {result.issues_detected.map((issue, index) => (
                      <li key={`${issue}-${index}`}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800">{text.noIssues}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-kisan-dark-green mb-2">{text.recommendations}</h3>
                {Array.isArray(result.recommended_actions) && result.recommended_actions.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    {result.recommended_actions.map((action, index) => (
                      <li key={`${action}-${index}`}>{action}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800">{text.noRecommendations}</p>
                )}
              </div>
            </div>
          )}
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

export default Simulation
