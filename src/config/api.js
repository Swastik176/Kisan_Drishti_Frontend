const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || 'http://127.0.0.1:8000'
const CNN_API_BASE_URL = import.meta.env.VITE_CNN_API_BASE_URL || 'http://127.0.0.1:8001'

export const API_BASE_URLS = {
  ML: ML_API_BASE_URL,
  CNN: CNN_API_BASE_URL,
}

export const API_ENDPOINTS = {
  CHATBOT: `${ML_API_BASE_URL}/ask/chatbot`,
  SENSOR_PREDICTION: `${ML_API_BASE_URL}/predict`,
  CNN_PREDICTION: `${CNN_API_BASE_URL}/cnn/predict`,
}

export default API_ENDPOINTS
